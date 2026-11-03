# Working on the Brand Butlers app

- The whole app is `app/index.html` (one self-contained page). Icons and manifest sit next to it.
- `dev` = test version at https://9kpkwdd79f-web.github.io/Brand-Butlers-app/preview/
- `main` = live app at https://9kpkwdd79f-web.github.io/Brand-Butlers-app/
- Every change goes to `dev` first. Only merge `dev` into `main` when the user says to deploy, and add a line to `CHANGELOG.md` with the release.
- Pushes from Claude sessions do not trigger the workflow by themselves. After pushing, start it with
  `POST /repos/9kpkwdd79f-web/Brand-Butlers-app/actions/workflows/deploy.yml/dispatches {"ref":"dev"}` (the workflow file on `dev` is the current one)
  (one run publishes both branches) and wait for it to finish before reporting.
- Never put NaaUt on the report. Client is always Apple.
- Rollback: revert the last merge on `main`, push, dispatch.

## Server (Supabase)
- Project `brand-butlers` (ref `gipkzcpaqlyiqawgunhu`, region eu-north-1), used by the test version. Connected through the Supabase connector.
- Tables: profiles (who may sign in, roles, status invited/reset/active/removed), stores, jobs, reports (draft data as JSON). Private storage bucket `photos`, one folder per job.
- Row level security: admins see everything; installers only reach their jobs through `my_jobs()` (their share, never the price) and the `job_*` functions. Check with `get_advisors` after schema changes.
- Sign-in is email + password only (Mathias decided against Sign in with Apple on 3 Nov 2026). Admins add the email first; the person then creates a password and confirms name and country.
- Edge functions: `account` (claim = first password / after reset, with name + country) and `admin` (add, update, reset, remove people; admins only).
- Trigger `guard_new_login` on auth.users: only emails in active profiles can get a login.
- The schema and functions are the migrations `core_schema` and `functions_storage_seed` in the project; read them with `list_migrations` / `get_edge_function` before changing anything.
- Before the first live deploy on Supabase: create a separate live project so test data never mixes with real data, and point the live build at it.

## Parked ideas
- Offline mode: plan in `docs/offline-mode.md`. Not built; wait for Mathias to decide.
