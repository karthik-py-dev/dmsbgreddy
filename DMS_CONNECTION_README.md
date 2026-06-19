# BG Reddy Website + DMS Owner Dashboard

This version keeps the public BG Reddy Dental Clinic website and adds a secure DMS owner login.

## What changed

- Public website remains available.
- Clinic Login / Owner Login opens DMS login.
- Login uses the same Supabase Auth account as the DMS app.
- Only `head_doctor` / `owner` role can open the web owner dashboard.
- Owner dashboard shows and controls:
  - Revenue summary
  - Pending amount
  - Waiting/completed patient counts
  - Patients
  - Appointments/follow-ups
  - Due payment reminders with WhatsApp
  - Staff list and staff invite creation
  - Clinic details update

## Required env setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Use the same Supabase project used by the DMS mobile app.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Cloudflare Pages

Build command:

```bash
npm run build
```

Build output directory:

```txt
dist
```

## Login behavior

When owner logs in successfully:

- The website opens the live DMS owner dashboard.
- The owner can see clinic data from Supabase.
- Non-owner roles are blocked from this web dashboard.

## Important

This web dashboard relies on the same database tables/RPCs already used in the DMS app:

- `profiles`
- `clinics`
- `patients`
- `appointments`
- `invoices`
- `payments`
- `staff_invites`
- RPCs like `get_workflow_dashboard_summary`, `get_pending_payment_patients`, `get_followup_reminders`, and `create_staff_invite`.

Run the latest DMS SQL patches first if any RPC is missing.
