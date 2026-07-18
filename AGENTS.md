# AI Agent Instructions for DiRT Rally 2 Lap Times

## Project Overview

**DiRT Rally 2.0 Lap Times Tracker** — A Vue 3 + TypeScript single-page web application for tracking and browsing rally stage lap times. Full-screen Google Map with location markers, left sidebar (location list → stage list drill-down), right sidebar (time table per stage with car group filter). No Vue Router; navigation is state-driven via Pinia.

**Status**: Work in Progress
**Branch Context**: `main` — Migrated from Firestore to PostgreSQL + PostgREST (same pattern as pc2-laptimes).

## Tech Stack

### Frontend
- **Framework**: Vue 3.2 (Composition API)
- **Language**: TypeScript ~4.7
- **Build Tool**: Vite 4
- **State Management**: Pinia 2
- **Styling**: SCSS/SASS
- **UI Components**:
  - Vue Select 4.0-beta (dropdowns)
  - vue-spinner (PulseLoader)
  - vue3-google-map (Google Maps wrapper)
  - flagpack (country flags)

### Backend
- **Database**: PostgreSQL 17
- **API**: PostgREST (auto-generated REST API from PostgreSQL schema)
- **Container Platform**: Podman pod with Postgres + PostgREST + Adminer
- **Deployment**: Homelab via `deploy.sh` + `Dockerfile` (`TARGET=malina`)

### Key Features
1. **Browse Times**: Click location marker or sidebar item → stages → time table sorted by driver/car
2. **Car Group Filter**: Dropdown filter on time table, options sorted by usage count
3. **Map Navigation**: Zoom/pan to location on marker/sidebar click, stage polylines overlay
4. **WebSocket Auto-Laptime**: Local game telemetry (`ws://<host>:20779`) auto-fills and submits laptime on race finish. Gated behind `isLocal()` check.
5. **Driver & Laptime CRUD**: Add/edit/delete laptimes and drivers (local-only).

## Project Structure

```
src/
├── assets/
│   ├── db/            # SQL migration scripts (create_tables.sql, grant_permissions.sql) + static game data (cars, locations)
│   └── map/           # GeoJSON, marker icons (base64)
├── components/        # Vue SFC components
│   └── modals/        # AddLaptime, AddDriver, EditLaptime modals
├── model/             # TypeScript interfaces and enums
├── plugins/           # api.ts (PostgREST fetch wrappers), googleMaps.ts (Maps API loader)
├── scss/              # Shared SCSS partials (_global.scss, _modal.scss)
├── stores/            # Pinia stores (data.ts, game-data.ts)
└── utils/             # GameDataReceiver (WebSocket), LaptimeUtil
```

## Component Tree

```
App.vue
├── MapView.vue           (full-screen Google Map, markers, polylines)
├── TrackPanel.vue        (left sidebar)
│   ├── LocationList.vue  (rally locations with country flags)
│   └── StageList.vue     (stages for active location)
└── ContentPanel.vue      (right sidebar, shown when stage selected)
    ├── CarGroupFilter.vue
    ├── TimeTable.vue      (gold/silver/bronze medals for top 3)
    ├── AddLaptimeModal.vue (includes ProviderHostnameSelect + LaptimeInput)
    ├── AddDriverModal.vue
    └── EditLaptimeModal.vue
```

## Data Flow

Two Pinia stores:

### `useDataStore` (data.ts)
- Static data: `cars` (80+ cars/group), `locations` (13 rally locations with stages)
- PostgREST-synced: `drivers`, `times` tables fetched on mount via `fetchAll()`
- CRUD actions: `addDriver`, `addLaptime`, `updateLaptime`, `deleteLaptime` → POST/PATCH/DELETE to PostgREST
- Panel state: `activeLocation`, `activeStage`, panel visibility flags
- `isLocal()`: true when host is `127.0.0.1:5173` or `dirt2.homelab.net`

### `useGameDataStore` (game-data.ts)
- WebSocket connection via `GameDataReceiver` singleton
- Tracks: `laptime`, `inMenu`, `finishedSuccessfully`
- Hardcoded host IPs (wallpc, deskpc)

## API Layer

`src/plugins/api.ts` provides `apiGet`, `apiPost`, `apiPatch`, `apiDelete` wrappers around `fetch()` to PostgREST. Uses `ts-case-convert` for snake_case ↔ camelCase conversion.

PostgREST URL: `http://localhost:3001` (dev) / `http://192.168.0.102:3001` (homelab).

## Database

Two tables (see `src/assets/db/create_tables.sql`):

```sql
drivers: uid UUID PK, name VARCHAR(100)
times:   uid UUID PK, driver_id UUID FK→drivers, car_id INT, location_id INT, stage_id INT,
         time VARCHAR(10), timestamp BIGINT, notes TEXT
```

Static game data (cars, locations, stages) stays in the frontend — they don't change.

## Navigation (State-Driven)

No Vue Router. All navigation via store state:

| Action | Store Call | Result |
|--------|-----------|--------|
| Click location (marker or sidebar) | `setActiveLocation(loc)` | Left panel shows StageList |
| Click stage | `setActiveStage(stage)` | Right panel shows TimeTable |
| Click back button | `setActiveLocation(null)` | Left panel shows LocationList |
| Deselect stage | `setActiveStage(null)` | Right panel hides |

## Modal Stack Pattern

`ContentPanel.vue` maintains a `modals[]` ref. `showModal(type)` pushes onto stack. Only the last modal is visible (`isModalActive` checks top). Modals emit `close` to pop themselves off.

## Coding Conventions

### TypeScript
- Interfaces in `src/model/`, one per file
- Static DB data in `src/assets/db/` as typed arrays/objects
- No `any` — use proper types
- Shim `.d.ts` files for JS libs without types
- `ts-case-convert` for snake↔camel case conversion on API calls

### Vue Components
- Composition API with `<script setup>`
- PascalCase filenames
- `storeToRefs` for reactive state reads, direct calls for actions

### CSS/SCSS
- `src/scss/_global.scss` injected globally via Vite `additionalData`
- `src/scss/_modal.scss` shared modal styles (`@import` in each modal)
- Scoped `<style>` in components

## Local vs Production

- **Local** (`isLocal()` is true): WebSocket connect UI, Add Laptime button, row click to edit, delete button in edit modal
- **Production** (`isLocal()` is false): Read-only view of times, no WebSocket UI

## Known Issues / Next Steps

1. **No real-time sync**: Data is fetched once on mount. Clients don't see each other's updates until page reload. Plan: add WebSocket relay (same pattern as pc2-laptimes)
2. **No router**: State-driven navigation works but lacks URL shareability
3. **WebSocket requires manual stage selection**: Dirt2 telemetry doesn't emit track ID, so user must select stage before racing
4. **No authentication on PostgREST**: Uses `postgres` superuser role (trusted LAN)

## Setup

```bash
cp .env.example .env
# Edit .env and add your Google Maps API key and Map ID (see .env.example)
npm install
npm run dev
```

## MCP Servers Used

- **Context7** — fetch current library/API documentation
- **Chrome DevTools** — inspect running app, check console errors

## Testing

- **Unit**: `npm run test:unit` (Vitest) — currently vestigial
- **E2E**: `npm run test:e2e` (Cypress) — placeholder test only
- **Lint**: `npm run lint`
- **Type check**: `npm run type-check`

## Deployment

- **Homelab**: `TARGET=malina npm run build && npm run deploy:homelab` — builds, SCPs to `hosting@hosting`, restarts systemd unit
- **Database init**: Run `src/assets/db/create_tables.sql` then `grant_permissions.sql` against the Postgres container once

## Commit Conventions

- Conventional commits: `type(scope): message`
- Single line, no body
- Examples: `feat(db): add migration scripts`, `refactor: clean up dead code`
