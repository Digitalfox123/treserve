export type ServiceType = "itinerary" | "temporary_reservation";

export type TripType = "one-way" | "return" | "multi-city";

export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type OrderStatus =
  | "AWAITING_PAYMENT"
  | "TEST_PAID"
  | "PAYMENT_FAILED"
  | "DOCUMENT_AVAILABLE"
  | "CANCELLED";

export type PaymentMode = "TEST" | "LIVE";

export interface Passenger {
  id: string;
  order_id?: string;
  title?: "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Prof";
  first_name: string;
  last_name: string;
  passenger_type: "adult" | "child" | "infant";
  created_at?: string;
}

export interface ItinerarySegment {
  id: string;
  order_id?: string;
  segment_sequence: number;
  flight_number: string;
  airline_name: string;
  airline_code: string;
  departure_airport: string;
  departure_city: string;
  arrival_airport: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  cabin_class: string;
  source_reference?: string;
  created_at?: string;
}

export interface ReservationRecord {
  id: string;
  order_id: string;
  supplier_name: string;
  supplier_reference?: string;
  actual_supplier_status: string;
  validity_information?: string;
  created_at?: string;
}

export interface PaymentEvent {
  id: string;
  order_id: string;
  payment_mode: PaymentMode;
  event_type: "CHECKOUT_INITIALIZED" | "SIMULATED_SUCCESS" | "SIMULATED_FAILURE" | "RETRY";
  amount: number;
  currency: string;
  test_mode_indicator: boolean;
  provider_reference?: string;
  error_message?: string;
  created_at?: string;
}

export interface DocumentRecord {
  id: string;
  order_id: string;
  document_type: "FLIGHT_ITINERARY_DOCUMENT" | "TEMPORARY_FLIGHT_RESERVATION";
  private_storage_path?: string;
  document_version: number;
  generation_status: "LOCKED" | "READY" | "FAILED";
  created_at?: string;
}

export interface Order {
  id: string;
  internal_reference: string;
  user_id?: string | null;
  guest_email?: string;
  guest_name?: string;
  service_type: ServiceType;
  trip_type: TripType;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string | null;
  passenger_count: number;
  cabin_class: CabinClass;
  currency: string;
  subtotal_amount: number;
  fee_amount: number;
  total_amount: number;
  order_status: OrderStatus;
  payment_mode: PaymentMode;
  passengers?: Passenger[];
  segments?: ItinerarySegment[];
  reservation_record?: ReservationRecord | null;
  documents?: DocumentRecord[];
  payment_events?: PaymentEvent[];
  created_at: string;
  updated_at: string;
}

export interface PricingConfig {
  id: string;
  name: string;
  price_usd: number;
  badge?: string;
  accent_color: "blue" | "green";
  description: string;
  delivery_time: string;
  features: string[];
  updated_at?: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string | null;
  order_id?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  action: string;
  record_type: string;
  record_identifier: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface FlightOption {
  id: string;
  airline_name: string;
  airline_code: string;
  flight_number: string;
  departure_airport: string;
  departure_city: string;
  arrival_airport: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: number;
  aircraft_type: string;
  demo_indicative_fare?: number;
  is_live?: boolean;
  source?: string;
  flight_date?: string;
  terminal_departure?: string;
  terminal_arrival?: string;
}
