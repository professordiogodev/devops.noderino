# AGENTS.md

Teaching repo: one-file Express app (`index.js`) used to practice env vars, Docker, and CI/CD. No build step, no framework tooling, no monorepo.

## Commands

- `npm install` — only deps are `express@5` and `dotenv`.
- `npm start` (`node index.js`) or `npm run dev` (`node --watch index.js`).
- Docker: `docker build -t noderino .` then
  `docker run -p 8080:8080 -e DESIRED_PATH=/docker -e NUMBER=100 noderino`.
- No lint, format, typecheck, or codegen config exists.

## `npm test` is a stub — do not trust it

`package.json` defines `test` as `echo "Tests passed! ..." && exit 0`. It never imports the code, so it passes no matter what you break. Verify by actually running the server:

```sh
PORT=9099 DESIRED_PATH=/secret NUMBER=7 node index.js &
curl -s localhost:9099/secret        # <h1>Hello from /secret number 7!</h1>
curl -s localhost:9099/healthcheck   # It works!
curl -s -o /dev/null -w '%{http_code}\n' localhost:9099/nope  # 404
```

## Things that are easy to get wrong

- Express **5**, not 4. The catch-all is a terminal `app.use((req, res) => ...)`; Express 4 patterns like `app.get("*")` are not used here.
- Route registration order is meaningful: env-derived greeting route, then `/healthcheck`, then the 404 handler. Anything appended after the 404 handler is unreachable.
- Env vars are read once at startup: `DESIRED_PATH` (default `/`), `PORT` (default `8080`), `NUMBER` (default `0`). Restart after editing `.env`.
- `DESIRED_PATH` is normalized for the route (leading slash added, extra leading slashes collapsed) but the response body and log line print the raw value. Preserve both behaviors.
- `.env` is gitignored and `.dockerignore`d; `.env.example` is the committed template. Never commit real `.env` contents.
- The Dockerfile pins `node:20-slim` while a dev machine may run a newer Node; there is no `engines` field. Don't add one without being asked.
- SIGTERM/SIGINT handlers do graceful `server.close()`; keep them when restructuring, since container/App Service shutdown depends on it.

## Branch / deploy context

- `main` is the deploy branch (Azure App Service). Deployment workflows were added and deleted repeatedly and **none are currently in-tree** — don't assume CI runs, and don't reinvent a workflow unless asked.
- Remote branches `slow`, `stdout-logs`, `file-logs` are diverged teaching variants of `index.js` (different logging approaches). They are not active work; don't merge them into `main` blindly.

`README.md` is the beginner-facing tutorial for setup and env var semantics; keep it in sync when behavior changes.
