# BG Reddy Website DMS Display Hotfix

This fixes the issue where DMS is connected but data is not showing properly on the website.

What changed:
- Stronger DMS connection layer.
- Website now detects whether Supabase came from `.env` or `public/dms-config.js`.
- Owner dashboard has clearer connection status.
- Dashboard uses RPC first and manual fallback if RPC is missing.
- Patients, appointments, dues, staff and clinic data now show better error messages instead of blank screens.
- Public website irrelevant DMS marketing text removed.
- Braces / Orthodontics added strongly as a service because the doctor does braces heavily.

Important:
Your `.env` must be in the project root, same place as `package.json`.

Correct `.env`:
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

After adding `.env`, run:
npm run dev

For deployment:
Cloudflare/Vercel will NOT use your local `.env` automatically.
Add the same variables in hosting dashboard, then redeploy:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

If deployed site still does not read env:
Fill `public/dms-config.js`, then redeploy.

Build:
npm install
npm run build

Cloudflare Pages:
Build command: npm run build
Output directory: dist
