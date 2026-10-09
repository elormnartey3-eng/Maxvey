# MAXVEY — Complete Luxury Streetwear E-Commerce Platform

> **"FOR THOSE WHO MOVE DIFFERENT."**

Official full-stack e-commerce storefront, product management, and order fulfillment platform for **MAXVEY** — an independent luxury streetwear imprint based in Lagos, Nigeria.

---

## ⚡ What Has Been Built

1. **Complete Brand Storefront**:
   - **Homepage**: Hero campaign with the official brand slogan *"FOR THOSE WHO MOVE DIFFERENT."*, drop announcement bar, brand specification strip (260GSM combed cotton, Lagos express dispatch, Paystack protection), featured drops, cyber metal showcase, newsletter subscription.
   - **Shop Page**: Product catalogue with interactive category filtering, instant search, price & date sorting, and stock counters.
   - **New Arrivals**: Curated seasonal drop releases.
   - **Collections**: Dedicated lookbook showcases ("Graffiti Star Drop 01" & "Cyber Metal Series").
   - **Product Detail Pages (PDP)**: Contiguous purchase module with multi-angle photography, size selector (S, M, L, XL, XXL) with popup size guide, colorway selectors, quantity steppers, live stock alerts, and a **sticky bottom buy bar on mobile (Android/iPhone)**.
   - **Shopping Bag**: Slide-over drawer and dedicated bag page with free shipping milestone tracker for Lagos orders.
   - **Checkout**: Delivery address form with Nigerian states selector, dynamic delivery fee calculation, and direct Paystack checkout integration.
   - **Interactive Payment Sandbox (`/checkout/test-pay`)**: Built-in simulator to test the complete card/transfer flow before connecting live bank keys.
   - **Order Confirmation (`/checkout/verify`)**: Payment verification receipt, step-by-step Lagos dispatch timeline, and 1-tap WhatsApp support button.
   - **Order Tracking (`/track`)**: Customers can enter their Order Number anytime to check QC, dispatch, and courier transit.
   - **Customer Care & Legal**: About Us, Contact Page with interactive form, Frequently Asked Questions (FAQ), Shipping Policy, Returns & Exchanges Policy, Privacy Policy, Terms & Conditions.

2. **Private Administrator Dashboard (`/admin`)**:
   - Secure login protected by server-side authorization middleware (`requireAdmin`).
   - **Product Management**: Add, edit, delete garments; adjust NGN prices and sale prices; manage sizes and colors; set stock counts; toggle Homepage Featured and New Drop status.
   - **Image Uploads**: Upload photographs directly from your Android phone or laptop, or paste image URLs.
   - **Order Fulfillment**: View all incoming customer orders with phone numbers, street addresses, items, and Paystack reference numbers. Update status (Pending → Paid → In QC → Dispatched → Delivered).
   - **Direct WhatsApp Customer Contact**: 1-tap link to chat with the customer on WhatsApp with pre-filled order details.
   - **Categories & Store Settings**: Edit the homepage announcement bar, brand slogan, delivery fees by Nigerian state, contact phone, and WhatsApp numbers.
   - **Notification Testing Tool**: 1-click button to dispatch a test order alert to `maxwellunusual@gmail.com` and `+2349029602573`.

3. **Backend & Architecture**:
   - Node.js & Express full-stack API server (`server.ts`).
   - Paystack transaction initialization, server-side price validation, verification, and cryptographic HMAC SHA-512 webhook handler.
   - Neon PostgreSQL schema (`src/db/schema.sql`) and zero-config local persistent database.
   - Automated Resend email dispatch and official WhatsApp Cloud API integration.

---

## 🔑 Administrator Credentials

- **Admin Login Route**: `/admin/login`
- **Default Master Password**: `MaxveyAdmin2026!`
- **Admin Email**: `maxwellunusual@gmail.com`
- *To change this password, set `ADMIN_PASSWORD="YourNewSecretPassword"` in your environment variables.*

---

## 🛠️ Environment Configuration (`.env`)

Refer to `.env.example`:

```bash
PORT=3000
APP_URL="https://your-domain.com"
ADMIN_PASSWORD="MaxveyAdmin2026!"
JWT_SECRET="maxvey_jwt_secret_key"

# Optional Neon PostgreSQL Connection (falls back to local persistent store if empty)
DATABASE_URL="postgresql://user:pass@ep-sample-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Paystack API Keys (https://dashboard.paystack.com/#/settings/developer)
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."

# Email Notifications (https://resend.com)
RESEND_API_KEY="re_..."
ADMIN_NOTIFICATION_EMAIL="maxwellunusual@gmail.com"

# Official WhatsApp Cloud API
ADMIN_NOTIFICATION_WHATSAPP="+2349029602573"
WHATSAPP_API_TOKEN="EAA..."
WHATSAPP_PHONE_NUMBER_ID="100..."
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start full-stack development server (Express + Vite)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
