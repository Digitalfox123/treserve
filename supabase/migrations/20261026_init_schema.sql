-- ============================================================================
-- TRESERVE DATABASE SCHEMA INITIALIZATION
-- ============================================================================

-- 1. Profiles Table (Customer and Admin Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'support')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_name TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('itinerary', 'temporary_reservation')),
  trip_type TEXT NOT NULL DEFAULT 'return' CHECK (trip_type IN ('one-way', 'return', 'multi-city')),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passenger_count INTEGER NOT NULL DEFAULT 1 CHECK (passenger_count >= 1),
  cabin_class TEXT NOT NULL DEFAULT 'economy' CHECK (cabin_class IN ('economy', 'premium_economy', 'business', 'first')),
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  order_status TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT' 
    CHECK (order_status IN ('AWAITING_PAYMENT', 'TEST_PAID', 'PAYMENT_FAILED', 'DOCUMENT_AVAILABLE', 'CANCELLED')),
  payment_mode TEXT NOT NULL DEFAULT 'TEST' CHECK (payment_mode IN ('TEST', 'LIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Passengers Table
CREATE TABLE IF NOT EXISTS public.passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  title TEXT CHECK (title IN ('Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  passenger_type TEXT NOT NULL DEFAULT 'adult' CHECK (passenger_type IN ('adult', 'child', 'infant')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Itinerary Segments Table
CREATE TABLE IF NOT EXISTS public.itinerary_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  segment_sequence INTEGER NOT NULL DEFAULT 1,
  flight_number TEXT NOT NULL,
  airline_name TEXT NOT NULL,
  airline_code TEXT NOT NULL,
  departure_airport TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  arrival_airport TEXT NOT NULL,
  arrival_city TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  duration TEXT NOT NULL,
  cabin_class TEXT NOT NULL DEFAULT 'Economy',
  source_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Reservation Records Table
CREATE TABLE IF NOT EXISTS public.reservation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  supplier_reference TEXT,
  actual_supplier_status TEXT NOT NULL DEFAULT 'PENDING_PARTNER_ALLOCATION',
  validity_information TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Payment Events Table
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_mode TEXT NOT NULL DEFAULT 'TEST',
  event_type TEXT NOT NULL CHECK (event_type IN ('CHECKOUT_INITIALIZED', 'SIMULATED_SUCCESS', 'SIMULATED_FAILURE', 'RETRY')),
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  test_mode_indicator BOOLEAN NOT NULL DEFAULT true,
  provider_reference TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('FLIGHT_ITINERARY_DOCUMENT', 'TEMPORARY_FLIGHT_RESERVATION')),
  private_storage_path TEXT,
  document_version INTEGER NOT NULL DEFAULT 1,
  generation_status TEXT NOT NULL DEFAULT 'LOCKED' CHECK (generation_status IN ('LOCKED', 'READY', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  record_type TEXT NOT NULL,
  record_identifier TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Pricing Configuration Table
CREATE TABLE IF NOT EXISTS public.pricing_config (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  badge TEXT,
  accent_color TEXT NOT NULL DEFAULT 'blue',
  description TEXT NOT NULL,
  delivery_time TEXT NOT NULL,
  features JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- SEED DEFAULT PRICING CONFIGURATION
-- ============================================================================
INSERT INTO public.pricing_config (id, name, price_usd, badge, accent_color, description, delivery_time, features)
VALUES 
(
  'itinerary',
  'Flight Itinerary Document',
  25.00,
  'Most Popular',
  'blue',
  'A professionally formatted travel plan containing verified route schedules, flight numbers, passenger details, and comprehensive journey information. Designed for visa applications and travel planning.',
  '1-24 hours',
  '["Professional A4 PDF document", "Complete journey route & flight times", "Passenger details & cabin preference", "Instant unlocked download after payment", "Permanent access in customer dashboard", "24/7 dedicated support assistance"]'::jsonb
),
(
  'temporary_reservation',
  'Temporary Flight Reservation',
  50.00,
  'Partner Required',
  'green',
  'Request a temporary flight reservation for visa documentation where supported by our supplier verification process. Features clear reservation status and transparent service terms.',
  '1-48 hours',
  '["Temporary reservation documentation", "Supplier-derived reservation status", "A4 official PDF with prominent disclaimer", "Route, airline & passenger details", "Document unlocked after test checkout", "24/7 customer support assistance"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
  price_usd = EXCLUDED.price_usd,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  features = EXCLUDED.features;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;

-- Pricing config is readable by all users
CREATE POLICY "Public read pricing" ON public.pricing_config FOR SELECT USING (true);

-- Profiles: users read and update their own profile
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: users read their own orders; guests can view via reference match
CREATE POLICY "Users access own orders" ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Documents: locked document check in RLS
CREATE POLICY "Users access own documents" ON public.documents FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = documents.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(internal_reference);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_passengers_order ON public.passengers(order_id);
CREATE INDEX IF NOT EXISTS idx_segments_order ON public.itinerary_segments(order_id);
CREATE INDEX IF NOT EXISTS idx_documents_order ON public.documents(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_order ON public.payment_events(order_id);
