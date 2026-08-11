# SKETCH — Real-Time Collaborative Whiteboard

A self-hosted, real-time collaborative sketching tool. Multiple users draw on the same canvas at once — rooms, shapes, freehand, live sync over WebSockets.

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Zustand + TanStack Query + RoughJS + Perfect Freehand
- **API**: Express 5 (Bun runtime) + JWT auth + bcrypt
- **Realtime**: `ws` WebSocket server (Bun runtime), room-based broadcast
- **Database**: PostgreSQL 16 + Prisma 7
- **Shared**: `@repo/types` Zod schemas, `@repo/backend-common` (JWT verify), `@repo/database` (Prisma client + services)
- **Monorepo**: Turborepo + Bun workspaces

## Quick start

### Prerequisites
- Bun 1.3+
- Docker Desktop (for Postgres)

### 1. Install
```bash
bun install
```

### 2. Configure env
Create `.env` files for the root, `apps/backend`, `apps/websocket`, and `apps/frontend` (none are committed — see variables below). Minimum required:

**Root / backend / websocket**
```
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/sketch
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**`apps/frontend/.env`**
```
NEXT_PUBLIC_HTTP_URL=http://localhost:9000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Start the database
```bash
docker compose up -d
```
- Postgres → `localhost:5432` (db `sketch`, user `postgres`)

### 4. Run migrations
```bash
cd packages/database
bun run migrate
bun run generate
```

### 5. Start the apps (in parallel via Turborepo)
```bash
bun run dev
```

- API → http://localhost:9000
- WebSocket → ws://localhost:8000
- Web → http://localhost:3000 (Next.js default; adjust if configured otherwise)

## Common scripts

| Script | Description |
|---|---|
| `bun run dev` | Run frontend + backend + websocket in parallel (Turborepo) |
| `bun run build` | Build all apps and packages |
| `bun run start` | Start built frontend, backend, and websocket |
| `bun run lint` | Lint all packages |
| `bun run check-types` | TypeScript check across the monorepo |
| `bun run format` | Prettier write across `.ts`/`.tsx`/`.md` |
| `packages/database`: `bun run migrate` | Apply Prisma migrations (dev) |
| `packages/database`: `bun run generate` | Regenerate Prisma client |

## Features

- **Auth**: Email/password signup & signin, bcrypt-hashed passwords, JWT (1-day expiry) issued on signin, `/auth/me` for session lookup, auth middleware protecting room/canvas routes.
- **Rooms**: Create room (unique name → slug), join room, leave room (auto-deletes room if the leaving user is the admin), verify room membership, list a user's rooms with participant counts.
- **Canvas / drawing engine**: Custom canvas engine (`CanvasEngine.ts`) with selection (`SelectionManager.ts`) and eraser (`Eraser.ts`) modules. Tools: Rectangle, Diamond, Ellipse, Arrow, Line, Freehand, Text, Selection, Eraser. Hand-drawn rendering via RoughJS; smooth freehand strokes via Perfect Freehand. Per-shape styling: roughness, stroke style/width, fill style/color, stroke color.
- **Realtime sync**: WebSocket server authenticates connections via JWT, tracks per-room membership in memory, and broadcasts `canvas:draw` / `canvas:update` / `canvas:erase` / `canvas:clear` events to everyone else in the room. Shapes are persisted to Postgres as they're drawn (`Canvas` table, JSON design payload).
- **Presence**: `user:connected` / `user:disconnected` broadcasts on room join/leave; a disconnect keeps the user's canvas contributions, an explicit leave removes them.
- **Validation**: All auth, room, and shape payloads validated with shared Zod schemas (`@repo/types`) on both client and server.

## Data model (Prisma)

- `User` — id (uuid), email (unique), password (hashed), name, photo, timestamps. Admin of rooms and member of rooms (many-to-many), owns canvas entries.
- `Room` — id (cuid), unique slug, admin (`User`), members (`User[]`), canvas entries. Deleting the admin's room cascades.
- `Canvas` — one row per shape: id, roomId, userId, `design` (JSON shape payload), createdAt. Cascades on user/room delete.

## Architecture

```
sketch/
├── apps/
│   ├── frontend/       # Next.js app (canvas UI, auth pages, dashboard)
│   ├── backend/        # Express REST API (auth, rooms, canvas) — port 9000
│   └── websocket/      # ws server for realtime drawing sync — port 8000
├── packages/
│   ├── database/       # Prisma schema, migrations, service layer
│   ├── types/          # Zod schemas + shared types (auth, room, canvas/shape)
│   ├── backend-common/ # Shared JWT verification
│   ├── ui/              # Shared React component stubs
│   ├── eslint-config/
│   └── typescript-config/
└── docker-compose.yaml # Postgres 16
```

## Security notes
- Passwords hashed with **bcrypt** (cost 10).
- JWT-authenticated REST routes (auth middleware) and WebSocket connections (token passed on connect).
- Room membership checked server-side before any canvas event is broadcast or persisted.
- Shape payloads validated against a shared Zod schema before being written to the database — invalid or malformed events are dropped, not broadcast.

## Notes / current limitations
- No refresh-token rotation yet — JWTs are single, 1-day-lived tokens.
- No password reset, email verification, or OAuth flow implemented.
- No rate limiting configured on the Express API.
- `packages/ui` is a starter stub, not yet used by the frontend app.