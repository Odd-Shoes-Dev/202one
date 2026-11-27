ALTER TABLE studio_checkout_payments
  ADD COLUMN pesapal_environment TEXT CHECK (pesapal_environment IN ('sandbox', 'live')),
  ADD COLUMN pesapal_tracking_id UUID UNIQUE;
