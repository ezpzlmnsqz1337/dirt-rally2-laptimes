# dirt-rally2-laptimes

Web app to store and browse DiRT Rally 2.0 stage times, backed by PostgreSQL + PostgREST.

## Setup

```bash
cp .env.example .env
# Fill in VITE_GOOGLE_MAPS_API_KEY, VITE_GOOGLE_MAPS_MAP_ID and (optionally) VITE_API_URL
npm install
npm run dev
```

The PostgREST URL defaults to `http://localhost:3003` on loopback hosts and
`http://192.168.0.102:3003` elsewhere; set `VITE_API_URL` to override it.

## Database

Initialise Postgres with `src/assets/db/create_tables.sql`, then run
`src/assets/db/grant_permissions.sql` against the Postgres container once.

## Deployment

`TARGET=malina npm run build && npm run deploy:homelab` builds, copies the app to the
homelab host, and restarts the systemd unit.

## Tests

```bash
npm run test:unit   # Vitest
npm run lint
npm run type-check
```

See [AGENTS.md](AGENTS.md) for architecture, conventions, and agent instructions.
