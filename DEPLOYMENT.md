# MAXVEY — Beginner-Friendly Deployment Guide (Android & Desktop)

This guide walks you step-by-step through deploying your MAXVEY website, connecting Neon PostgreSQL, activating Paystack payments, and setting up notifications — even if you are using only an Android phone!

---

## 📱 Mobile-First Overview: What You Need

You only need accounts on 3 platforms to go live for free:
1. **GitHub** (github.com) — Stores your code repository (Free)
2. **Neon** (neon.tech) — PostgreSQL Database (Free forever tier)
3. **Render** (render.com) or **Railway** (railway.app) — Hosts your website and Express API (Free / Low Cost)
4. **Paystack** (dashboard.paystack.com) — Nigerian payments (Free to create, 1.5% transaction fee only when a customer pays)

---

## STEP 1: Push Code to GitHub

1. Create a free account at [github.com](https://github.com) from your phone's browser.
2. Tap the **+** icon in the top right and tap **New repository**.
3. Name it `maxvey-clothing` and tap **Create repository**.
4. Push or upload your project files to this repository.

---

## STEP 2: Create Free Neon PostgreSQL Database

1. Open your browser on your phone and go to [neon.tech](https://neon.tech).
2. Tap **Sign Up** (you can sign up with your Google account in one tap).
3. Tap **Create Project**, name it `maxvey-db`, and choose the default cloud region.
4. On the dashboard, tap **Dashboard** > **Connection Details**.
5. Copy the connection string starting with `postgresql://...`.
6. Tap **SQL Editor** in Neon's sidebar, paste the contents of `src/db/schema.sql`, and tap **Run**. All database tables are now created!

---

## STEP 3: Deploy to Render (Recommended for Android)

Render can be set up entirely from an Android phone in 3 minutes:

1. Go to [render.com](https://render.com) and sign up with your GitHub account.
2. Tap **New +** and select **Web Service**.
3. Select your `maxvey-clothing` GitHub repository.
4. Fill in the following settings:
   - **Name**: `maxvey`
   - **Region**: Frankfurt or Oregon
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js` (or `npm start`)
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   - `ADMIN_PASSWORD` = `YourSecureAdminPassword123!`
   - `DATABASE_URL` = `your_neon_connection_string_from_step_2`
   - `PAYSTACK_SECRET_KEY` = `your_paystack_secret_key`
   - `PAYSTACK_PUBLIC_KEY` = `your_paystack_public_key`
   - `ADMIN_NOTIFICATION_EMAIL` = `maxwellunusual@gmail.com`
   - `ADMIN_NOTIFICATION_WHATSAPP` = `+2349029602573`
6. Tap **Create Web Service**. Render will build and launch your live website at `https://maxvey.onrender.com`!

---

## STEP 4: Activate Live Paystack Payments

1. Go to [dashboard.paystack.com](https://dashboard.paystack.com) on your phone.
2. Tap **Settings** (gear icon) > **API Keys & Webhooks**.
3. Copy:
   - **Live Secret Key**: starts with `sk_live_...`
   - **Live Public Key**: starts with `pk_live_...`
4. In the **Live Webhook URL** field, enter:
   `https://your-domain.onrender.com/api/paystack/webhook`
5. Add these keys into Render's Environment Variables.
6. Now, whenever a customer buys a shirt in Nigeria, Paystack processes the debit card, confirms the order, and deposits money directly into your Nigerian bank account!

---

## STEP 5: WhatsApp & Email Notifications

### Email Notifications (Resend)
1. Sign up for free at [resend.com](https://resend.com).
2. Generate an API Key starting with `re_...`.
3. Add `RESEND_API_KEY` to Render's environment variables.
4. Every time an order is paid, a receipt and order breakdown is emailed to `maxwellunusual@gmail.com`.

### WhatsApp Notifications
- **Instant Option (Zero Cost)**: The website generates 1-tap WhatsApp chat buttons directly from the admin dashboard and order confirmation receipt that open WhatsApp on your phone with the customer's order pre-filled!
- **Meta WhatsApp Cloud API Option**: If you want fully automated background WhatsApp messages, create a Meta Developer App at [developers.facebook.com](https://developers.facebook.com) > WhatsApp > Quickstart, and add `WHATSAPP_API_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` to your environment variables.

---

## STEP 6: Managing Your Store from Your Android Phone

1. Open your live website on Chrome on your Android phone.
2. Go to `https://your-website.com/admin/login`.
3. Enter your password.
4. You can now:
   - Take a photo of a new shirt with your phone's camera and upload it directly.
   - Adjust prices (e.g., ₦28,500).
   - Change stock quantities.
   - Check customer orders, see their address, and tap **Message Customer on WhatsApp** to coordinate delivery!
