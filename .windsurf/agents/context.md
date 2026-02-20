# LISQ — Project Context

## Overview
LISQ is a self-hosted list and notes application with a clean, pen-and-paper aesthetic inspired by Korean minimal stationery design. Users deploy via Docker with a volume-mounted SQLite database for full data persistence.

## Architecture

### Monorepo Structure
- **Root** — npm workspaces, Docker config, README
- **`/marketing`** — Static marketing/landing site (Astro + React + Tailwind)
- **`/app`** — Main application (Astro SSR + React + Tailwind + SQLite + Drizzle ORM)

### App Tech Stack
- **Framework**: Astro 4 with `@astrojs/node` adapter (SSR, standalone mode)
- **UI**: React 18 components hydrated via `client:load`
- **Styling**: Tailwind CSS 3 with CSS variable-based theming (`--s-*` surface, `--t-*` accent)
- **Database**: SQLite via `better-sqlite3` (single-file, WAL mode)
- **ORM**: Drizzle ORM with schema in `app/src/db/schema.ts`
- **Rich Text**: TipTap (ProseMirror) with StarterKit + Underline + Link + Placeholder
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Icons**: Lucide React
- **IDs**: nanoid

### Marketing Tech Stack
- **Framework**: Astro 4 (static output)
- **UI**: React 18 + Tailwind CSS 3
- **Icons**: Lucide React

## Database Schema
- **lists** — id, name, description, type (todo/gear/shopping/prep/general), icon, color, **mode (checklist/inventory)**, timestamps
- **items** — id, list_id (FK), parent_id (nullable FK for sub-items), content, checked, notes, quantity, priority (low/medium/high/critical), sort_order, timestamps
- **notes** — id, title, content (HTML), pinned, timestamps

Auto-creates tables on first connection via raw SQL in `app/src/db/index.ts`.
Includes migrations for: `mode` column on lists, `parent_id` column + index on items.

## API Routes (Astro Server Endpoints)

| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/lists` | List all / create |
| `GET/PATCH/DELETE` | `/api/lists/[id]` | Get (with items) / update / delete |
| `POST` | `/api/items` | Create item (supports `parentId` for sub-items) |
| `PATCH/DELETE` | `/api/items/[id]` | Update / delete item |
| `GET/POST` | `/api/notes` | List all / create |
| `GET/PATCH/DELETE` | `/api/notes/[id]` | Get / update / delete note |

## React Component Tree
```
AppShell (client:load)
├── ThemeProvider — React context for active theme, persists to localStorage
├── Sidebar — list navigation, view toggle (lists/notes/themes), notes count, create button
├── ListDetail — active list view with items, settings dropdown to toggle mode
│   └── SortableListItem → ListItem — click-to-expand row, mode-aware (checklist/inventory)
│       └── SubItem — one-level-deep nested items
├── NotesList — card grid of all notes, pinned section, create/delete
├── NoteEditor — TipTap rich text editor, auto-save, pin/delete, cmd+click links
├── ThemeSelector — 20+ theme cards with mini-previews (light & dark)
├── EmptyState — no list selected / loading state
└── CreateListModal — new list form with mode, type, color, description
```

## Features

### Lists & Items
- **Two modes**: Checklist (checkboxes, progress bar, completed section) vs Inventory (bullet dots, flat list)
- **Sub-items**: Nest items one level deep with parent_id
- **Click to expand**: Clicking anywhere on an item row toggles expand/collapse (shows sub-items + notes)
- **Drag & drop**: Reorder items via drag handles (@dnd-kit)
- **Priority badges**: Critical/High/Medium/Low with color-coded badges
- **Import Markdown**: Import `.md` files as lists

### Notes
- **Rich text editor**: TipTap with StarterKit + Underline + Link + Placeholder
- **Formatting**: Bold, Italic, Underline, Heading 1/2/3, Paragraph, Bullet List, Ordered List, Links
- **Cmd+click links**: Hold ⌘ (Mac) or Ctrl (Win/Linux) and click any link to open in new tab
- **Link toolbar button**: Insert/edit hyperlinks via toolbar button
- **Auto-save**: Content debounced at 600ms, title saved on blur
- **Pin/Unpin**: Pinned notes appear in a separate section at top

### Themes (20+ built-in)
- **Light**: Paper (default), GitHub Light, Solarized Light, Catppuccin Latte, Ayu Light, Gruvbox Light
- **Dark**: One Dark Pro, Dracula, GitHub Dark, Monokai Pro, Solarized Dark, Nord, Catppuccin Mocha, Tokyo Night, Gruvbox Dark, Palenight, Ayu Dark, Synthwave '84, Rosé Pine, Vitesse Dark
- Defined in `app/src/lib/themes.ts` as surface[11] + accent[11] hex arrays
- Applied via CSS variables (`--s-*`, `--t-*`) in `applyTheme()`
- Persisted in `localStorage` key `lisq-theme`

## Design System
- **Theme**: Pen & paper, Korean minimal — soft whites, clean ink, subtle indigo accent
- **Color token strategy**: `dark-*` scale: 50=text(ink) → 950=bg(white). `tactical-*` = accent scale.
- **Fonts**: Inter (sans), JetBrains Mono (mono accents)
- **Components**: `btn-primary`, `btn-ghost`, `btn-danger`, `input`, `card`, `badge-*`
- **TipTap styles**: `.tiptap-editor` + `.tiptap-link` classes in `global.css`

## Docker & Deployment

### Files
- `Dockerfile` — Multi-stage build (deps → build → runtime), node:20-alpine
- `docker-compose.yml` — Single service, port 4321, volume mount for `/data`

### Environment Variables
| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `/data/lisq.db` | SQLite file path inside container |
| `HOST` | `0.0.0.0` | Server bind address |
| `PORT` | `4321` | Server port |
| `DATA_PATH` | `./data` | Host path mounted to `/data` (docker-compose only) |

### Data Persistence
Mount any host directory to `/data` via `DATA_PATH` env var:
```bash
DATA_PATH=/path/to/data docker compose up -d
```
SQLite file auto-creates on first run. Data survives container restarts, rebuilds, upgrades.

## Commands
```bash
npm install              # Install all workspace deps
npm run dev:app          # App dev server (port 4321)
npm run dev:marketing    # Marketing dev server (port 3000)
npm run build:app        # Build app for production
npm run build:marketing  # Build marketing site
npm run db:push          # Push schema via Drizzle Kit
npm run db:studio        # Open Drizzle Studio
docker compose up -d     # Run in Docker
```

## What's Built
- [x] Root monorepo config (package.json, Docker, README)
- [x] Marketing site with Navbar, Hero, Features, ThemeShowcase, Footer
- [x] App with full CRUD API routes (lists, items, notes)
- [x] Database schema + auto-initialization + migration support
- [x] React components: AppShell, Sidebar, ListDetail, ListItem, CreateListModal, EmptyState
- [x] Pen & paper Tailwind design system (paper whites, indigo accent, Korean minimal)
- [x] API client utility (`app/src/lib/api.ts`)
- [x] List mode feature: checklist (checkboxes) vs inventory (bullets)
- [x] Per-list settings dropdown to toggle mode
- [x] Full Notes UI: NotesList (card grid) + NoteEditor (TipTap rich text)
- [x] Rich text editing: bold, italic, underline, H1-H3, bullet/ordered lists, links
- [x] Notes auto-save, pin/unpin, create/delete
- [x] Cmd+click to open links in notes in new tab
- [x] Click-to-expand list items (entire row toggles expand/collapse)
- [x] Sub-items (one level deep with parent_id)
- [x] Drag-and-drop reordering for list items
- [x] 20+ themes (light & dark) with ThemeSelector + ThemeProvider
- [x] Import Markdown as lists
- [x] Comprehensive README, Dockerfile, docker-compose docs
- [x] Dependencies installed, TypeScript compiles clean

## Next Steps / TODO
- [ ] List templates (pre-built bug-out bag, camping, etc.)
- [ ] Search/filter within lists
- [ ] Export/import lists (JSON, CSV)
- [ ] Mobile responsive polish
- [ ] PWA support
- [ ] Auth layer (optional, for multi-user deployments)
- [ ] Playwright e2e tests
