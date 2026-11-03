# Brand Butlers app

Reporting platform for Brand Butlers: admins create tickets for Apple fixture work, installers file reports with photos and a store sign-off.

## How it is deployed

| Branch | Where it goes | Use |
| --- | --- | --- |
| `main` | Live app, site root | What people use. Only updated when a change is agreed. |
| `dev` | Test version, `/preview/` | New work lands here first to try on the phone. |

Every push to `main` or `dev` runs `.github/workflows/deploy.yml` and publishes both to GitHub Pages within a minute or two. Releasing = merging `dev` into `main`. Rolling back = reverting the last merge on `main`.

The test version keeps its own saved data, separate from the live app.

## Files

- `app/index.html` – the whole app (one self-contained page)
- `app/manifest.webmanifest`, `app/icon-*.png` – Add to Home Screen support
- `CHANGELOG.md` – what changed in each release
