# Pesapal checkout

The `/book` checkout takes UGX deposits and full payments through Pesapal API 3.0. Pesapal hosts the payment page and shows the methods available to the merchant account. The app checks the transaction reference, amount, and currency with Pesapal before confirming a booking. The browser return and Pesapal’s Instant Payment Notification (IPN) both trigger verification.

## Set up a test deployment

1. Use a sandbox Neon database. For an existing database with migrations through `008`, apply [`009_add_pesapal_checkout.sql`](../neon/migrations/009_add_pesapal_checkout.sql) in the Neon SQL Editor. On a new database, apply all migration files in order.
2. Choose the public HTTPS origin for the sandbox app. In Pesapal’s [IPN registration form](https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/registeripnurl), register `https://YOUR-TEST-HOST/api/payments/pesapal` using the sandbox account. Select `POST` or `GET` and copy the returned `ipn_id`. The app sends the browser to `https://YOUR-TEST-HOST/book/payment/confirm` after payment.
3. Set these server environment variables on the sandbox host. For local development, use `.env.local` and a public HTTPS tunnel to reach the running app.

   ```dotenv
   DATABASE_URL=postgresql://...
   PESAPAL_ENVIRONMENT=sandbox
   PESAPAL_CONSUMER_KEY=your-sandbox-consumer-key
   PESAPAL_CONSUMER_SECRET=your-sandbox-consumer-secret
   PESAPAL_IPN_ID=your-registered-ipn-id
   PESAPAL_SITE_URL=https://YOUR-TEST-HOST
   ```

4. Restart or redeploy and visit `/book`. The page displays **Pesapal sandbox**. Make a deposit and a full payment with [Pesapal test payment details](https://www.pesapal.com/blog/pesapal-test-cards-how-to-test-payments-in-the-pesapal-sandbox). Check the correct remaining balance on each receipt and confirm the bookings in Admin. Complete one payment without returning to the site to verify that the IPN alone updates the booking.

## Go live

Use the production Neon database, apply migration `009`, and register the production site's own IPN URL with the live merchant account. Set `PESAPAL_ENVIRONMENT=live`, the live consumer key and secret, the corresponding production IPN ID, and the production HTTPS origin. Keep the values in the server environment. Confirm the studio’s rates in [`lib/studio-quote.ts`](../lib/studio-quote.ts) before enabling live charges. Check that the deployed IPN route is publicly reachable.

While Pesapal is unconfigured, the booking page shows the browser-only demo. The checkout holds a slot for up to 15 minutes. Payments verified after the hold ends, amount or currency mismatches, and reversals appear for studio review in the receipt and the booking’s admin notes. Review any outstanding Flutterwave test checkouts before switching providers. Previous records will remain visible in Admin and on their receipt links.

[Pesapal API 3.0 reference](https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference) · [Transaction verification and IPN responses](https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/gettransactionstatus)
