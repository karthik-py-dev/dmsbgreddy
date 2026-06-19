# BG Reddy Website Owner Admin Gallery + Export Upgrade

This adds more owner/admin content to the connected DMS website dashboard.

No public route change is required.

## Added to owner dashboard

1. Gallery Audit tab
- Shows patient clinical uploads
- File type: X-ray, prescription, before photo, after photo, report, other
- Patient name, phone, patient ID
- Who uploaded the file
- Upload date/time
- View file link
- Export CSV

2. Visit Audit tab
- Shows every patient visit
- Patient name, phone, patient ID
- Chief complaint
- Follow-up date
- Which doctor added the visit
- Export CSV

3. Export Center tab
Owner can export:
- Patients CSV
- Visit audit CSV
- Gallery upload audit CSV
- Pending dues CSV
- Payments CSV
- Invoices CSV
- Appointments CSV
- Staff CSV
- Full Owner Audit JSON

4. Overview polish
- Added visits recorded count
- Added gallery uploads count
- Added staff account count
- Added Recent visits
- Added Recent uploads

## Files changed

- src/main.jsx
- src/dmsClient.js
- src/styles.css
- OWNER_ADMIN_GALLERY_EXPORT_SQL_PATCH.sql

## SQL

Run this optional SQL if Gallery Audit or Visit Audit is empty because RPCs are missing:

OWNER_ADMIN_GALLERY_EXPORT_SQL_PATCH.sql

## Env reminder

.env must be in same folder as package.json:

VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

After adding or changing env:

npm run dev

For Cloudflare/Vercel:
Add the same environment variables in hosting dashboard and redeploy.

## Build

npm install
npm run build
