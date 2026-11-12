# Privacy by design

Rules every change to the Brand Butlers app must follow.

## Rules
1. **Passwords** are hashed with SHA-256 in the browser (`pwHash`, salted with the email) before they leave the device. Supabase Auth then stores that value only as a salted bcrypt hash. No readable password is ever sent, stored or logged. The `account` edge function rejects anything that is not a 64-character SHA-256 hash.
2. **Collect only what the work needs.** Installers: name, email, phone (optional), country. Reports: store contact name, answers, photos, videos, signatures. Nothing else is collected. There is no tracking, no analytics and no advertising.
3. **No third parties in the browser.** All code, including supabase-js and jsPDF, is served from the app's own site (`app/vendor/`). The app talks only to its own site and to Supabase (EU, eu-north-1). The page sends no referrer.
4. **Least access.** Row level security everywhere: installers only reach their own jobs through `my_jobs()` and never see prices. Before sign-in, `account_status` only says whether an email may sign in (no names or countries).
5. **Private files.** Photos, signatures and videos sit in private buckets and are shown through short-lived links (photos 10 minutes, videos 15 minutes).
6. **Nothing personal in logs or URLs.** No `console.log` of personal data. No personal data in links or query strings.
7. **Leave little on the device.** Signing out removes the session, cached links and the remembered email.
8. **Erase when people leave.** Removing a person deletes their login and phone number; only the name stays, because old reports need it.
9. **Edge functions** accept calls only from the app's own website (CORS) and log nothing from the request.

## Open points
- Before going live: a separate live Supabase project, so test data never mixes with real data.
- A retention period for old reports and photos (for example, delete after X years). Not decided yet.
