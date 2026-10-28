# Treserve — Plan Today · Travel Tomorrow

> **Premium Flight Itinerary & Temporary Flight Reservation Platform**  
> Professional documentation platform for visa applications, embassy submissions, and travel planning with real-time flight data integration and instant A4 vector PDF document generation.

---

## 🌟 Key Features

- **Live Flight Search Integration:**
  - Real-time global flight lookup powered by Google Flights (RapidAPI) with automatic fallback to AviationStack.
  - Interactive multi-city, return, and one-way route search with intelligent airport auto-complete across major international hubs.

- **Legitimate Flight Documentation:**
  - Verified Flight Itineraries & Temporary Flight Reservations with unique internal booking references (`TR-YYYYMMDD-XXXXXX`).
  - Clear mandatory visa compliance disclaimers adhering to international embassy requirements.

- **Instant A4 Vector PDF Generation:**
  - High-resolution, vector-accurate, print-ready A4 PDF generation via `pdf-lib`.
  - Embedded official brand logos, QR verification placeholders, barcode simulation, and passenger breakdown.
  - Protected document lock: PDFs are strictly locked until payment or simulation completion.

- **Authentication & User Portals:**
  - Seamless authentication powered by Supabase Auth (Sign Up, Sign In, Session Management).
  - **Customer Dashboard:** Manage saved itineraries, track reservation statuses, and download issued documents.
  - **Internal Admin Console:** Dedicated secure operations route (`/portal-admin-secure-8820`) protected with master passkey authentication for order monitoring, ticket handling, and real-time pricing adjustments.

- **End-to-End Verification:**
  - Built-in comprehensive E2E test suite (`node scripts/test-e2e.mjs`) covering 32 validation assertions across orders, payments, documents, and pricing.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (Turbopack, App Router, React 19)
- **Styling:** Tailwind CSS v4
- **Database & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **PDF Generation:** `pdf-lib`
- **Image Processing:** `sharp`
- **Flight Data APIs:** RapidAPI (Google Flights), AviationStack
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+ installed
- npm or pnpm

### 2. Clone and Install
```bash
git clone https://github.com/Digitalfox123/treserve.git
cd treserve
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Treserve
NEXT_PUBLIC_APP_TAGLINE=Plan Today · Travel Tomorrow
NEXT_PUBLIC_TEST_MODE=true

# Flight Search APIs
RAPIDAPI_KEY=your_rapidapi_key
AVIATIONSTACK_KEY=your_aviationstack_key
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Automated Tests
```bash
node scripts/test-e2e.mjs
```

### 6. Production Build
```bash
npm run build
npm start
```

---

## 📄 License
Private commercial project. All rights reserved by **Treserve Travel Technologies**.
