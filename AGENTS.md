# AI Agent Instructions for DiRT Rally 2 Lap Times

## Project Overview

**DiRT Rally 2.0 Lap Times Tracker** — A Vue 3 + TypeScript single-page web application for tracking and browsing rally stage lap times. Full-screen Google Map with location markers, left sidebar (location list → stage list drill-down), right sidebar (time table per stage with car group filter). No Vue Router; navigation is state-driven via Pinia.

**Status**: Work in Progress
**Branch Context**: `main` — Using Firestore for data, planning migration to PostgreSQL + PostgREST (same pattern as pc2-laptimes).

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
- **Database**: Firestore (Firebase)
- **Hosting**: Firebase Hosting (production) / Podman + nginx (homelab)
- **Deployment**: GitHub Actions → Firebase Hosting on merge to `main`. Homelab via `deploy.sh` + `Dockerfile` (`TARGET=malina`).

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
│   ├── css/           # Global CSS (legacy, unused)
│   ├── db/            # Static game data: cars, locations, stages
│   └── map/           # GeoJSON, KML, marker icons (base64 + PNG)
├── components/        # Vue SFC components
│   └── modals/        # AddLaptime, AddDriver, EditLaptime modals
├── model/             # TypeScript interfaces and enums
├── plugins/           # Firebase init and config
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
- Firestore-synced: `drivers`, `laptimes` collections via `onSnapshot`
- CRUD actions: `addDriver`, `addLaptime`, `editLaptime`, `deleteLaptime`
- Panel state: `activeLocation`, `activeStage`, panel visibility flags
- Offline: `enableIndexedDbPersistence`
- `isLocal()`: true when host is `127.0.0.1:5173` or `dirt2.homelab.net`

### `useGameDataStore` (game-data.ts)
- WebSocket connection via `GameDataReceiver` singleton
- Tracks: `laptime`, `inMenu`, `finishedSuccessfully`
- Hardcoded host IPs (wallpc, deskpc)

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

1. **Firestore rules expired** (July 2022): Writes fail silently in production
2. **Firebase API key exposed** in `src/plugins/firebaseConfig.ts`
3. **Rallycross data present but not surfaced** in UI (no rallycross tab/panel)
4. **No router**: State-driven navigation works but lacks URL shareability
5. **WebSocket requires manual stage selection**: Dirt2 telemetry doesn't emit track ID, so user must select stage before racing
6. **Google Maps API key required**: Set `VITE_GOOGLE_MAPS_API_KEY` in `.env` (copy from `.env.example`). Without it the map shows an error overlay
7. **`google.maps.Marker` deprecated** (Feb 2024): Upgrade `vue3-google-map` to ≥0.18 when AdvancedMarker support stabilizes

## Setup

```bash
cp .env.example .env
# Edit .env and add your Google Maps API key
npm install
npm run dev
```

## MCP Servers Used

- **Context7** — fetch current library/API documentation (e.g. `vue3-google-map`)
- **Chrome DevTools** — inspect running app, check console errors, take snapshots

## Testing

- **Unit**: `npm run test:unit` (Vitest) — currently vestigial
- **E2E**: `npm run test:e2e` (Cypress) — placeholder test only
- **Lint**: `npm run lint`
- **Type check**: `npm run type-check`

## Deployment

- **Firebase Hosting**: Auto-deployed on merge to `main` via `.github/workflows/firebase-hosting-merge.yml`
- **Homelab**: `TARGET=malina npm run build && npm run deploy:homelab` — builds, SCPs to `hosting@hosting`, restarts systemd unit
- **Emulators**: `firebase.json` configures Firestore emulator on port 8080

## Commit Conventions

- Conventional commits: `type(scope): message`
- Single line, no body
- Examples: `feat(db): add migration scripts`, `refactor: clean up dead code`
