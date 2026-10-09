import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import type { Product, Category, Order, StoreSettings } from '../types/index.ts';
import { initialProducts, initialCategories, initialStoreSettings } from './seedData.ts';

interface DatabaseData {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  subscribers: { email: string; subscribedAt: string }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export class Database {
  private data: DatabaseData;
  private pool: Pool | null = null;
  private activeDatabaseUrl: string | null = null;
  public isPostgresConnected = false;

  constructor() {
    ensureDataDir();
    this.data = this.loadData();
    this.setupPostgres(process.env.DATABASE_URL);
  }

  public async setupPostgres(connectionUrl?: string): Promise<{ success: boolean; message: string; timestamp?: string }> {
    const url = connectionUrl || process.env.DATABASE_URL;
    if (!url || !url.startsWith('postgres')) {
      this.isPostgresConnected = false;
      return { success: false, message: 'No PostgreSQL connection string provided' };
    }

    try {
      if (this.pool) {
        await this.pool.end().catch(() => {});
      }

      this.pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false }, // required for Neon / cloud Postgres
        connectionTimeoutMillis: 5000,
      });

      const res = await this.pool.query('SELECT NOW() as current_time, current_database() as db_name;');
      this.isPostgresConnected = true;
      this.activeDatabaseUrl = url;

      // Ensure tables exist or sync initial data
      await this.syncToPostgresIfEmpty();

      return {
        success: true,
        message: `Successfully connected to Neon PostgreSQL (${res.rows[0].db_name})`,
        timestamp: res.rows[0].current_time,
      };
    } catch (err: any) {
      console.warn('Postgres connection failed, using local persistent DB:', err.message);
      this.isPostgresConnected = false;
      return { success: false, message: err.message || 'Failed to connect to PostgreSQL' };
    }
  }

  private async syncToPostgresIfEmpty() {
    if (!this.pool || !this.isPostgresConnected) return;
    try {
      // Check if products table exists and has rows
      const prodCheck = await this.pool.query(
        "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = 'products';"
      );
      if (Number(prodCheck.rows[0]?.count) > 0) {
        const rows = await this.pool.query('SELECT COUNT(*) as count FROM products;');
        if (Number(rows.rows[0]?.count) === 0) {
          // Insert initial products
          for (const p of this.data.products) {
            await this.pool.query(
              `INSERT INTO products (id, name, slug, tagline, description, details, care_instructions, price, compare_at_price, category, collection, images, featured_image, sizes, colors, stock, is_featured, is_new_arrival)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
               ON CONFLICT (id) DO NOTHING;`,
              [
                p.id,
                p.name,
                p.slug,
                p.tagline || '',
                p.description,
                JSON.stringify(p.details),
                JSON.stringify(p.careInstructions || []),
                p.price,
                p.compareAtPrice || null,
                p.category,
                p.collection || null,
                JSON.stringify(p.images),
                p.featuredImage,
                JSON.stringify(p.sizes),
                JSON.stringify(p.colors),
                p.stock,
                p.isFeatured,
                p.isNewArrival,
              ]
            );
          }
        }
      }
    } catch (err) {
      console.warn('Could not auto-seed Postgres (run schema.sql in Neon SQL Editor):', err);
    }
  }

  public getDatabaseStatus() {
    return {
      connected: this.isPostgresConnected,
      provider: this.isPostgresConnected ? 'Neon PostgreSQL' : 'Local Persistent Storage',
      connectionUrlRedacted: this.activeDatabaseUrl
        ? this.activeDatabaseUrl.replace(/:([^:@]+)@/, ':****@')
        : null,
      totalProducts: this.data.products.length,
      totalOrders: this.data.orders.length,
    };
  }

  private loadData(): DatabaseData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          products: parsed.products?.length ? parsed.products : initialProducts,
          categories: parsed.categories?.length ? parsed.categories : initialCategories,
          orders: parsed.orders || [],
          settings: parsed.settings ? { ...initialStoreSettings, ...parsed.settings } : initialStoreSettings,
          subscribers: parsed.subscribers || [],
        };
      }
    } catch {
      // Fallback
    }

    const initial: DatabaseData = {
      products: initialProducts,
      categories: initialCategories,
      orders: [],
      settings: initialStoreSettings,
      subscribers: [],
    };
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave?: DatabaseData) {
    try {
      ensureDataDir();
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return this.data.products.filter(p => !p.isArchived);
  }

  public getAllProductsAdmin(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug === slug);
  }

  public saveProduct(product: Product): Product {
    const existingIndex = this.data.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      this.data.products[existingIndex] = {
        ...this.data.products[existingIndex],
        ...product,
        updatedAt: new Date().toISOString(),
      };
    } else {
      this.data.products.unshift({
        ...product,
        createdAt: product.createdAt || new Date().toISOString(),
      });
    }
    this.persist();

    // Async sync to Postgres if connected
    if (this.pool && this.isPostgresConnected) {
      this.pool
        .query(
          `INSERT INTO products (id, name, slug, tagline, description, details, care_instructions, price, compare_at_price, category, collection, images, featured_image, sizes, colors, stock, is_featured, is_new_arrival, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             price = EXCLUDED.price,
             stock = EXCLUDED.stock,
             details = EXCLUDED.details,
             updated_at = NOW();`,
          [
            product.id,
            product.name,
            product.slug,
            product.tagline || '',
            product.description,
            JSON.stringify(product.details),
            JSON.stringify(product.careInstructions || []),
            product.price,
            product.compareAtPrice || null,
            product.category,
            product.collection || null,
            JSON.stringify(product.images),
            product.featuredImage,
            JSON.stringify(product.sizes),
            JSON.stringify(product.colors),
            product.stock,
            product.isFeatured,
            product.isNewArrival,
          ]
        )
        .catch(e => console.warn('Postgres product sync notice:', e.message));
    }

    return product;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      if (this.pool && this.isPostgresConnected) {
        this.pool.query('DELETE FROM products WHERE id = $1;', [id]).catch(() => {});
      }
      return true;
    }
    return false;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public saveCategory(category: Category): Category {
    const idx = this.data.categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      this.data.categories[idx] = category;
    } else {
      this.data.categories.push(category);
    }
    this.persist();
    return category;
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return [...this.data.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public getOrderByNumber(orderNumber: string): Order | undefined {
    const normalized = orderNumber.trim().toUpperCase();
    return this.data.orders.find(o => o.orderNumber.toUpperCase() === normalized || o.id === normalized);
  }

  public getOrderByPaystackRef(ref: string): Order | undefined {
    return this.data.orders.find(o => o.paystackReference === ref);
  }

  public saveOrder(order: Order): Order {
    const idx = this.data.orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      this.data.orders[idx] = {
        ...this.data.orders[idx],
        ...order,
        updatedAt: new Date().toISOString(),
      };
    } else {
      this.data.orders.unshift(order);
    }
    this.persist();

    // Async sync to Postgres if connected
    if (this.pool && this.isPostgresConnected) {
      this.pool
        .query(
          `INSERT INTO orders (id, order_number, customer_full_name, customer_email, customer_phone, customer_address, customer_city, customer_state, items, subtotal, delivery_fee, total, status, payment_status, payment_method, paystack_reference, paystack_paid_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
           ON CONFLICT (id) DO UPDATE SET
             status = EXCLUDED.status,
             payment_status = EXCLUDED.payment_status,
             paystack_paid_at = EXCLUDED.paystack_paid_at,
             updated_at = NOW();`,
          [
            order.id,
            order.orderNumber,
            order.customer.fullName,
            order.customer.email,
            order.customer.phone,
            order.customer.address,
            order.customer.city,
            order.customer.state,
            JSON.stringify(order.items),
            order.subtotal,
            order.deliveryFee,
            order.total,
            order.status,
            order.paymentStatus,
            order.paymentMethod,
            order.paystackReference || null,
            order.paystackPaidAt ? new Date(order.paystackPaidAt) : null,
          ]
        )
        .catch(e => console.warn('Postgres order sync notice:', e.message));
    }

    return order;
  }

  public updateOrderStatus(id: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Order | undefined {
    const order = this.data.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }
      order.updatedAt = new Date().toISOString();
      this.persist();

      if (this.pool && this.isPostgresConnected) {
        this.pool
          .query('UPDATE orders SET status = $1, payment_status = COALESCE($2, payment_status), updated_at = NOW() WHERE id = $3;', [
            status,
            paymentStatus || null,
            id,
          ])
          .catch(() => {});
      }

      return order;
    }
    return undefined;
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
    };
    this.persist();
    return this.data.settings;
  }

  // --- NEWSLETTER ---
  public addNewsletterSubscriber(email: string): boolean {
    const clean = email.trim().toLowerCase();
    const exists = this.data.subscribers.some(s => s.email === clean);
    if (!exists) {
      this.data.subscribers.push({
        email: clean,
        subscribedAt: new Date().toISOString(),
      });
      this.persist();
      if (this.pool && this.isPostgresConnected) {
        this.pool.query('INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT DO NOTHING;', [clean]).catch(() => {});
      }
      return true;
    }
    return false;
  }

  public getSubscribers(): { email: string; subscribedAt: string }[] {
    return this.data.subscribers;
  }
}

export const db = new Database();
