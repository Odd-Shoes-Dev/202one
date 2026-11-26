# Flutterwave test checkout

The studio booking flow uses sample UGX prices and Flutterwave Standard hosted checkout. The customer can choose Uganda Mobile Money or card, then return to the site to check their booking status.

## Local checkout test

1. Use a test Neon database. Apply `neon/migrations/008_create_studio_checkout_payments.sql` after the existing migrations. On a new database, apply the migration files in order in the Neon SQL Editor.
2. Create a Flutterwave for Business account and switch to **Test Mode** in the dashboard. Open Settings → API Keys and copy the v3 test secret key. [Flutterwave Test Mode](https://flutterwave.com/ug/support/integrations/flutterwave-live-and-test-environments)
3. In `.env.local`, fill in `DATABASE_URL` and `FLUTTERWAVE_SECRET_KEY`. Keep the generated `FLUTTERWAVE_WEBHOOK_SECRET` and the local return URL. If starting from a fresh checkout of the source, create `.env.local` with these settings and generate a random webhook secret.

   ```dotenv
   DATABASE_URL=postgresql://...
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
   FLUTTERWAVE_WEBHOOK_SECRET=your-random-webhook-secret
   FLUTTERWAVE_RETURN_URL=http://127.0.0.1:3000/book/payment/confirm
   ```

4. Restart Next.js and open `/book#booking-flow`. The page displays **Flutterwave test mode** once the test configuration is present. Allow Uganda Mobile Money and card in the test account. Turn off **Disable preferred payment methods** so the checkout can pass its payment options.
5. Start with a deposit using sample customer details and a Flutterwave test card. After returning to the website, check that the payment status shows the verified deposit and correct remaining balance. Repeat with a full payment and check that the balance is zero. [Flutterwave test payment data](https://developer.flutterwave.com/docs/testing)

## Automatic webhook test

Deploy to a publicly reachable HTTPS test site with the same four server-side settings. Set `FLUTTERWAVE_RETURN_URL` to `https://YOUR-TEST-SITE/book/payment/confirm`. In the Flutterwave test dashboard, register `https://YOUR-TEST-SITE/api/payments/flutterwave`, enter the webhook secret from the test site environment, and enable webhook retries. After a successful test checkout, verify that the booking updates even when the browser skips the return page.

The browser-only booking demo remains available while the test credentials are being set up. Late or mismatched payments appear for studio review.

[Flutterwave Standard](https://developer.flutterwave.com/docs/collections-inflow/flutterwave-standard) · [Flutterwave webhooks](https://developer.flutterwave.com/docs/webhooks)
