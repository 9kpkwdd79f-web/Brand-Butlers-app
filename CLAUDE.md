# Working on the Brand Butlers app

- The whole app is `app/index.html` (one self-contained page). Icons and manifest sit next to it.
- `dev` = test version at https://9kpkwdd79f-web.github.io/Brand-Butlers-app/preview/
- `main` = live app at https://9kpkwdd79f-web.github.io/Brand-Butlers-app/
- Every change goes to `dev` first. Only merge `dev` into `main` when the user says to deploy, and add a line to `CHANGELOG.md` with the release.
- Pushes from Claude sessions do not trigger the workflow by themselves. After pushing, start it with
  `POST /repos/9kpkwdd79f-web/Brand-Butlers-app/actions/workflows/deploy.yml/dispatches {"ref":"main"}` (only `main` may publish; keep `.github/workflows/deploy.yml` the same on both branches)
  (one run publishes both branches) and wait for it to finish before reporting.
- The deploy script stamps `const BUILD = '__BUILD__'` in each copy with that branch's commit; open apps compare it with the published page and show "New version available". Keep that line in `app/index.html`.
- Desktop layout: admins on screens 1024 px and wider get `body.desk` (sidebar, Overview dashboard with table + side panel, Approvals list + report panel). Built in the DESKTOP LAYOUT block (`isDesk`, `renderSide`, `overviewDesk`, `approvalsDesk`, `deskPanel`). Round 2 (desktop only): New ticket in two columns with a live summary (`newDesk`, `ntSummary`), Insights with charts (`insightsDesk`, country colours `--c0..--c3`), library grid with search/filters/drag-and-drop/hover preview (`videosDesk`, `pickFiles`), and a big-screen video editor (draggable clip edges, clip list, keyboard shortcuts). Phones and the installer view are unchanged; keep desktop-only styling under `body.desk` / desktop functions.
- Never put NaaUt on the report. Client is always Apple.
- Rollback: revert the last merge on `main`, push, dispatch.

## Server (Supabase)
- Project `brand-butlers` (ref `gipkzcpaqlyiqawgunhu`, region eu-north-1), used by the test version. Connected through the Supabase connector.
- Tables: profiles (who may sign in, roles, status invited/reset/active/removed), stores, jobs, reports (draft data as JSON), templates (fixture templates: name, tools, parts) and tools (the shared tools list). Templates and tools are made by admins in New ticket and shared by all admins; there are no built-in ones. Private storage bucket `photos`, one folder per job (50 MB, JPEG/PNG and video since migration `report_extras`). Installers can add any number of extra photos and videos to a report before submitting (`report.extras` = [{k, kind, poster, dur}], `extrasBlock`, `addExtras`); admins see them in the approval view. Installers can take back their own submitted report to edit it until an admin handles it (`job_reopen`: waiting → progress, report back to draft, `jobs.reopened_at`; admins see "Installer is editing"; approve/ask-for-changes only update jobs still `waiting`). `jobs.sent_back` counts send-backs (trigger) for Insights. Migration `installer_reopen`. During photos and sign-off a floating "Instructions" button reopens the ticket's video instructions.
- Row level security: admins see everything; installers only reach their jobs through `my_jobs()` (their share, never the price) and the `job_*` functions. Check with `get_advisors` after schema changes.
- Video library: table `videos` + private bucket `videos` (`<id>/video.<ext>`, `<id>/poster.jpg`, max 50 MB). Admins upload under Manage → Videos and assign videos to templates and tickets (`video_ids`). Installers get them via `my_jobs()` / `my_videos()`; the button is always called "Video instructions". Migration `video_library`. The library also holds pictures (`videos.kind` = 'video' | 'image'; pictures stored as `<id>/image.jpg` + `<id>/poster.jpg`, resized in the browser). Uploads accept several files at once. Migration `library_pictures`. Pictures can be cropped and rotated (picture editor, `PE`): the original stays at `videos.edit.orig`, the cropped copy becomes `path`/`poster` (`<id>/edited-<ts>.jpg`).
- Video editing is non-destructive: `videos.edit` (jsonb: segments, texts, fadeIn/fadeOut/fadeBetween, volume 0–2, muted, speed) is applied on playback by `makePlayer`; the original file is never changed. Auto edit samples frames (`analyzeMotion`) and keeps the parts with movement; step texts come from the video's notes. Migration `video_edits`.
- All amounts are in Danish kroner (DKK) for every country. Insights shows "Revenue not approved yet" (`pipeline`: all non-approved tickets, any date, split waiting / in progress / planned).
- Ticket times are always 24-hour (00:00–23:59): hour and minute selects plus a tappable day planner (`dayPlan`) showing the installer's other jobs that day. Don't use `<input type="time">` (it shows AM/PM on US-locale phones).
- Sign-in is email + password only (Mathias decided against Sign in with Apple on 3 Nov 2026). Admins add the email first; the person then creates a password and confirms name and country.
- Edge functions: `account` (claim = first password / after reset, with name + country) and `admin` (add, update, reset, remove people; admins only).
- Trigger `guard_new_login` on auth.users: only emails in active profiles can get a login.
- The schema and functions are the migrations `core_schema`, `functions_storage_seed`, `apple_sign_in` (now only the login guard and account_status with country), `templates_and_tools`, `video_library`, `video_edits`, `library_pictures`, `report_extras` and `installer_reopen` in the project; read them with `list_migrations` / `get_edge_function` before changing anything.
- Before the first live deploy on Supabase: create a separate live project so test data never mixes with real data, and point the live build at it.

## Parked ideas
- Offline mode: plan in `docs/offline-mode.md`. Not built; wait for Mathias to decide.
