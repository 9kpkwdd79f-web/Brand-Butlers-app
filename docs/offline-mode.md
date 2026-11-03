# Offline mode (planned, not built yet)

Status: agreed as a good idea on 3 Nov 2026, parked until Mathias decides to build it.

## Goal
An installer can do a whole job without signal (basements, inside shopping centres). Everything is saved on the phone and sent to Supabase automatically when the connection is back.

## What the installer sees
- A small status line at the top: "Offline – everything is saved on this phone", "Sending 6 photos…", "All sent ✓".
- They can open the app, see today's jobs, start the report, take all 8 photos, get the store signature and press Submit, all offline.
- If they submit offline, the job shows "Submitted – will be sent when you have signal". The admin sees it as soon as the phone is online again.

## How it works
1. **The app opens without internet.** A service worker keeps a copy of the app (page, icons, Supabase library) on the phone.
2. **The last data is kept on the phone.** Every load saves a copy of the installer's jobs, last-visit notes and support numbers (IndexedDB). Offline, the app shows that copy.
3. **Outbox for everything they do.** Every change goes into a queue on the phone: start job, report text, each photo, signature, submit. Photos are stored on the phone as files, so nothing is lost if the app is closed or the phone restarts.
4. **Automatic sending.** When signal returns, the queue is sent in order (start → photos → report → submit). Failures retry by themselves.
5. **Correct time.** The report keeps the time the work was actually done, not the time it was sent.

## Conflicts
- If an admin reassigns or cancels a job while the installer is offline, the server wins. The installer gets a clear message, and their photos and report are kept.
- Only the lead installer writes to a report, so two people can't overwrite each other.

## iPhone limits
- **Sends when the app is open.** Safari doesn't allow background sending after the app is closed. The installer opens the app once they have signal; the status line and a reminder ("3 photos haven't been sent yet") make that clear.
- **Add to Home Screen.** Safari can clear stored data for websites that haven't been used for a while, but not for Home Screen apps. Home Screen is the recommended way for installers.
- **First sign-in needs internet.** After that you stay signed in offline.

## Admin side
Admins mostly work at a desk. Offline they can view the overview, but not create tickets or approve. Keeps it simple and avoids conflicts.

## Size and testing
Fits the current Supabase setup without server changes; one round of work, tested first on the test version with flight mode: start a job, take photos and sign in flight mode, close the app, turn flight mode off, and watch the report reach Approvals.
