# Working on the Brand Butlers app

- The whole app is `app/index.html` (one self-contained page). Icons and manifest sit next to it.
- `dev` = test version at https://9kpkwdd79f-web.github.io/Brand-Butlers-app/preview/
- `main` = live app at https://9kpkwdd79f-web.github.io/Brand-Butlers-app/
- Every change goes to `dev` first. Only merge `dev` into `main` when the user says to deploy, and add a line to `CHANGELOG.md` with the release.
- Pushes from Claude sessions do not trigger the workflow by themselves. After pushing, start it with
  `POST /repos/9kpkwdd79f-web/Brand-Butlers-app/actions/workflows/deploy.yml/dispatches {"ref":"main"}`
  (one run publishes both branches) and wait for it to finish before reporting.
- Never put NaaUt on the report. Client is always Apple.
- Rollback: revert the last merge on `main`, push, dispatch.
