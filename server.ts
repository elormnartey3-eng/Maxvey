import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db } from './src/db/db.ts';
import { paystack } from './src/services/paystack.ts';
import { notifications } from './src/services/notifications.ts';
import type { Order, Product, CartItem } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MaxveyAdmin2026!';
const JWT_SECRET = process.env.JWT_SECRET || 'maxvey_jwt_secret_dev_key';

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Support raw body for Paystack Webhook signature verification
app.use(express.json({
  limit: '25mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString();
  },
}));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple, secure token generator for admin session
function generateAdminToken(): string {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`admin_session:${timestamp}`)
    .digest('hex');
  return Buffer.from(JSON.stringify({ role: 'super_admin', timestamp, signature })).toString('base64');
}

function verifyAdminToken(token?: string): boolean {
  if (!token) return false;
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.timestamp || !parsed.signature) return false;
    // Check expiration: 7 days
    if (Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) return false;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`admin_session:${parsed.timestamp}`)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(parsed.signature), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

// Middleware: Require Admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    return;
  }
  next();
}

// =========================================================================
// API ROUTES
// =========================================================================

// --- HEALTH CHECK ---
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'MAXVEY Storefront & API', time: new Date().toISOString() });
});

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password, email } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = generateAdminToken();
    res.json({
      success: true,
      token,
      user: {
        id: 'admin_1',
        email: email || process.env.ADMIN_NOTIFICATION_EMAIL || 'maxwellunusual@gmail.com',
        name: 'Maxwell (MAXVEY Admin)',
        role: 'super_admin',
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid administrator password' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (verifyAdminToken(token)) {
    res.json({
      authenticated: true,
      user: {
        id: 'admin_1',
        email: process.env.ADMIN_NOTIFICATION_EMAIL || 'maxwellunusual@gmail.com',
        name: 'Maxwell (MAXVEY Admin)',
        role: 'super_admin',
      },
    });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// --- PRODUCTS ---
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, includeArchived } = req.query;
  let products = includeArchived === 'true' ? db.getAllProductsAdmin() : db.getProducts();

  if (category && typeof category === 'string' && category !== 'all') {
    products = products.filter(
      p => p.category.toLowerCase() === category.toLowerCase() || p.collection?.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    products = products.filter(
      p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.slug.includes(term)
    );
  }

  res.json(products);
});

app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
  const identifier = req.params.slugOrId;
  const product = db.getProductBySlug(identifier) || db.getProductById(identifier);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const prodData: Product = req.body;
  if (!prodData.name || !prodData.price) {
    res.status(400).json({ error: 'Product name and price are required' });
    return;
  }
  const id = prodData.id || `mv-prod-${Date.now()}`;
  const slug = prodData.slug || prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProduct: Product = {
    ...prodData,
    id,
    slug,
    createdAt: new Date().toISOString(),
  };
  const saved = db.saveProduct(newProduct);
  res.status(201).json(saved);
});

app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = db.getProductById(id);
  if (!existing) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const updated = db.saveProduct({ ...existing, ...req.body, id });
  res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteProduct(id);
  if (deleted) {
    res.json({ success: true, message: 'Product deleted' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// --- CATEGORIES ---
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const cat = req.body;
  if (!cat.name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }
  const id = cat.id || `cat-${Date.now()}`;
  const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const saved = db.saveCategory({ ...cat, id, slug });
  res.status(201).json(saved);
});

// --- ORDERS ---
app.get('/api/orders', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getOrders());
});

app.get('/api/orders/:idOrNumber', (req: Request, res: Response) => {
  const param = req.params.idOrNumber;
  const order = db.getOrderByNumber(param) || db.getOrderById(param);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

app.put('/api/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const updated = db.updateOrderStatus(id, status, paymentStatus);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(updated);
});

// --- STORE SETTINGS ---
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// --- DATABASE STATUS & NEON CONNECTION ---
app.get('/api/database/status', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getDatabaseStatus());
});

app.post('/api/database/connect', requireAdmin, async (req: Request, res: Response) => {
  const { databaseUrl } = req.body;
  if (!databaseUrl || typeof databaseUrl !== 'string') {
    res.status(400).json({ error: 'Valid database connection URL required' });
    return;
  }

  const result = await db.setupPostgres(databaseUrl.trim());
  if (result.success) {
    // Also save to .env file for persistence across server restarts
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
      if (envContent.includes('DATABASE_URL=')) {
        envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${databaseUrl.trim()}"`);
      } else {
        envContent += `\nDATABASE_URL="${databaseUrl.trim()}"\n`;
      }
      fs.writeFileSync(envPath, envContent, 'utf-8');
    } catch (err) {
      console.warn('Could not update .env file:', err);
    }

    res.json({
      success: true,
      message: result.message,
      timestamp: result.timestamp,
      status: db.getDatabaseStatus(),
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.message,
    });
  }
});

// --- PAYSTACK CHECKOUT INITIALIZE ---
app.post('/api/paystack/initialize', async (req: Request, res: Response) => {
  try {
    const { items, customer, deliveryFeeOverride, paymentMethod = 'paystack' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Cart items are required' });
      return;
    }
    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.address || !customer.state) {
      res.status(400).json({ error: 'Complete delivery details are required' });
      return;
    }

    // SERVER-SIDE PRICE & STOCK VALIDATION
    let calculatedSubtotal = 0;
    const validatedItems: Order['items'] = [];

    for (const item of items as CartItem[]) {
      const dbProduct = db.getProductById(item.productId);
      if (!dbProduct) {
        res.status(400).json({ error: `Product not found: ${item.name}` });
        return;
      }
      if (dbProduct.stock < item.quantity) {
        res.status(400).json({
          error: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock}`,
        });
        return;
      }
      calculatedSubtotal += dbProduct.price * item.quantity;
      validatedItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: dbProduct.featuredImage || dbProduct.images[0] || '/images/tee-black.jpg',
      });
    }

    // Server-side delivery fee calculation
    const settings = db.getSettings();
    let deliveryFee = settings.defaultDeliveryFee;
    const matchedState = settings.deliveryFees.find(
      d => d.state.toLowerCase().includes(customer.state.toLowerCase()) || customer.state.toLowerCase().includes(d.state.toLowerCase())
    );
    if (matchedState) {
      deliveryFee = matchedState.fee;
    }
    // Free delivery check if threshold met
    if (settings.freeDeliveryThreshold > 0 && calculatedSubtotal >= settings.freeDeliveryThreshold) {
      deliveryFee = 0;
    }
    if (deliveryFeeOverride !== undefined && typeof deliveryFeeOverride === 'number') {
      deliveryFee = deliveryFeeOverride;
    }

    const calculatedTotal = calculatedSubtotal + deliveryFee;

    const orderNumber = `MV-${new Date().toISOString().slice(2, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const paystackRef = `MV_PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      total: calculatedTotal,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod,
      paystackReference: paystackRef,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save initial pending order to database
    db.saveOrder(newOrder);

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const callbackUrl = `${protocol}://${host}/checkout/verify?ref=${paystackRef}&orderId=${orderId}`;

    // Initialize with Paystack
    const initResult = await paystack.initializeTransaction(newOrder, callbackUrl);

    res.json({
      success: true,
      order: newOrder,
      authorization_url: initResult.authorization_url,
      reference: initResult.reference,
      access_code: initResult.access_code,
      isTestSandbox: initResult.isTestSandbox,
    });
  } catch (err: any) {
    console.error('Checkout initialization error:', err);
    res.status(500).json({ error: err.message || 'Failed to initialize checkout' });
  }
});

// --- PAYSTACK VERIFY TRANSACTION ---
app.get('/api/paystack/verify/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    const order = db.getOrderByPaystackRef(reference);

    if (!order) {
      res.status(404).json({ error: 'Order matching this payment reference was not found' });
      return;
    }

    if (order.paymentStatus === 'verified') {
      res.json({
        success: true,
        alreadyVerified: true,
        order,
      });
      return;
    }

    const verification = await paystack.verifyTransaction(reference, order.total);

    if (verification.verified) {
      // Mark order paid
      order.status = 'paid';
      order.paymentStatus = 'verified';
      order.paystackPaidAt = verification.paidAt || new Date().toISOString();
      db.saveOrder(order);

      // Safely decrement stock quantities
      for (const item of order.items) {
        const prod = db.getProductById(item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          db.saveProduct(prod);
        }
      }

      // Dispatch administrator notifications (email + WhatsApp)
      // Note: notification failure is caught and logged; it never alters order status!
      notifications.sendOrderNotifications(order).catch(err => {
        console.error('Notification dispatch failed non-fatally:', err);
      });

      res.json({
        success: true,
        order,
        details: verification,
      });
    } else {
      order.paymentStatus = 'failed';
      db.saveOrder(order);
      res.status(400).json({
        success: false,
        error: verification.message || 'Payment verification failed',
      });
    }
  } catch (err: any) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: err.message || 'Failed to verify transaction' });
  }
});

// --- PAYSTACK WEBHOOK (Cryptographic HMAC verification) ---
app.post('/api/paystack/webhook', async (req: any, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const rawBody = req.rawBody || JSON.stringify(req.body);

    // Cryptographic validation
    if (paystack.isConfigured()) {
      const isValid = paystack.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        res.status(400).send('Invalid signature');
        return;
      }
    }

    const event = req.body;
    if (event && event.event === 'charge.success') {
      const data = event.data;
      const ref = data.reference;
      const order = db.getOrderByPaystackRef(ref);

      if (order && order.paymentStatus !== 'verified') {
        order.status = 'paid';
        order.paymentStatus = 'verified';
        order.paystackPaidAt = data.paid_at || new Date().toISOString();
        db.saveOrder(order);

        // Update stock
        for (const item of order.items) {
          const prod = db.getProductById(item.productId);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - item.quantity);
            db.saveProduct(prod);
          }
        }

        // Notify admin
        notifications.sendOrderNotifications(order).catch(err => {
          console.error('Webhook notification dispatch failed:', err);
        });
      }
    }

    // Always respond 200 OK to Paystack within 5 seconds to prevent webhook retries
    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('Error handling Paystack webhook:', err);
    res.status(500).send('Server error');
  }
});

// --- NEWSLETTER SUBSCRIPTION ---
app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address required' });
    return;
  }
  const added = db.addNewsletterSubscriber(email);
  res.json({ success: true, message: added ? 'Subscribed successfully' : 'Already subscribed' });
});

// --- IMAGE UPLOAD (Base64 data or multipart) ---
app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'No image data provided' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const safeName = `${Date.now()}-${(filename || 'product.jpg').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);
    const url = `/uploads/${safeName}`;

    res.json({
      success: true,
      url,
      filename: safeName,
    });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// --- TEST NOTIFICATIONS DISPATCH (Admin verification tool) ---
app.post('/api/notifications/test', requireAdmin, async (_req: Request, res: Response) => {
  const sampleOrder: Order = {
    id: `test_order_${Date.now()}`,
    orderNumber: `MV-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: {
      fullName: 'Maxwell (Test Customer)',
      email: 'maxwellunusual@gmail.com',
      phone: '+2349029602573',
      address: 'Plot 12 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      notes: 'Test order notification verification from admin dashboard',
    },
    items: [
      {
        productId: 'mv-prod-001',
        name: 'MAXVEY "Graffiti Star" Oversized Tee — Jet Black',
        price: 28500,
        quantity: 1,
        size: 'L',
        color: 'Jet Black',
        image: '/images/tee-black.jpg',
      },
    ],
    subtotal: 28500,
    deliveryFee: 2500,
    total: 31000,
    status: 'paid',
    paymentStatus: 'verified',
    paymentMethod: 'paystack',
    paystackReference: `TEST_REF_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const outcome = await notifications.sendOrderNotifications(sampleOrder);
  const clickToChatUrl = notifications.getWhatsAppClickToChatUrl(sampleOrder);

  res.json({
    success: true,
    outcome,
    clickToChatUrl,
    summary: notifications.formatOrderSummaryText(sampleOrder),
  });
});

// =========================================================================
// DEV VS PROD SERVER INITIALIZATION
// =========================================================================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: Dynamically load Vite and mount middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built client bundle
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ MAXVEY Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
