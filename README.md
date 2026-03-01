# LISQ

A beautiful, self-hosted list and notes app with a clean pen-and-paper aesthetic inspired by Korean minimal stationery design. Create todo lists, gear checklists, shopping lists, bug-out bags, and rich-text notes — all stored in a single SQLite file you own.

## Features

- **Lists** — Create lists with types (todo, shopping, gear, prep, general) and color-coded icons
- **Two modes** — Checklist (checkboxes, progress bar, completed section) or Inventory (bullet dots, flat list). Toggle anytime.
- **Sub-items** — Nest items one level deep. Click any item row to expand/collapse sub-items and notes.
- **Rich Notes** — Full TipTap rich-text editor: bold, italic, underline, H1–H3, bullet/ordered lists, hyperlinks
- **Cmd+click links** — Hold ⌘ (Mac) or Ctrl (Win/Linux) and click any link in a note to open it in a new tab
- **Drag & drop** — Reorder list items via drag handles
- **20+ themes** — Light and dark themes including Paper, GitHub, Solarized, Catppuccin, Dracula, Nord, Tokyo Night, Synthwave '84, Rosé Pine, and more
- **Priority badges** — Critical, High, Medium, Low with color-coded badges
- **Pin notes** — Pin important notes to the top
- **Import Markdown** — Import `.md` files as lists
- **Self-hosted** — Your data never leaves your infrastructure. Single SQLite file, Docker-ready.

---

## Quick Start with Docker

```bash
docker compose up -d
```

The app will be available at **http://localhost:4321**. Your data is stored in `./data/lisq.db` by default.

### Custom database location

To persist your database at a specific path on the host (survives container restarts, rebuilds, etc.):

```bash
DATA_PATH=/path/to/your/data docker compose up -d
```

This mounts `DATA_PATH` into the container at `/data`. The SQLite file is created at `/data/lisq.db` inside the container.

**Examples:**

```bash
# Store in your home directory
DATA_PATH=~/lisq-data docker compose up -d

# Store on an external drive
DATA_PATH=/mnt/nas/lisq docker compose up -d

# Use default (./data in project root)
docker compose up -d
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `/data/lisq.db` | Path to SQLite database inside the container |
| `HOST` | `0.0.0.0` | Server bind address |
| `PORT` | `4321` | Server port |
| `DATA_PATH` | `./data` | Host path mounted to `/data` (docker-compose only) |

### Docker details

- **Image**: `node:20-alpine` (multi-stage build)
- **Exposed port**: `4321`
- **Volume**: Host `DATA_PATH` → Container `/data`
- **Restart policy**: `unless-stopped`
- **Database**: Auto-creates tables on first run, auto-migrates schema on upgrades

---

## Development

### Prerequisites

- Node.js 20+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run the app (port 4321)

```bash
npm run dev:app
```

### Run the marketing site (port 3000)

```bash
npm run dev:marketing
```

### Database commands

```bash
npm run db:push      # Push schema changes via Drizzle Kit
npm run db:studio    # Open Drizzle Studio GUI
```

---

## Project Structure

```
lisq.io/
├── app/                     # Main application (Astro SSR + React + Tailwind + SQLite)
│   ├── src/
│   │   ├── components/      # React UI components
│   │   │   ├── AppShell.tsx      # Root shell — state, handlers, routing
│   │   │   ├── Sidebar.tsx       # Navigation sidebar (lists, notes, themes)
│   │   │   ├── ListDetail.tsx    # Active list view with items & settings
│   │   │   ├── ListItem.tsx      # Mode-aware item row (checklist/inventory) + sub-items
│   │   │   ├── NotesList.tsx     # Card grid of notes (pinned section)
│   │   │   ├── NoteEditor.tsx    # TipTap rich-text editor with auto-save
│   │   │   ├── ThemeSelector.tsx # Theme picker with mini-preview cards
│   │   │   ├── ThemeProvider.tsx # React context for theme state
│   │   │   ├── CreateListModal.tsx # New list form
│   │   │   ├── EditItemModal.tsx   # Edit item dialog
│   │   │   └── EmptyState.tsx      # Placeholder when no list selected
│   │   ├── db/
│   │   │   ├── schema.ts        # Drizzle ORM schema (lists, items, notes)
│   │   │   └── index.ts         # DB connection, auto-create tables, migrations
│   │   ├── lib/
│   │   │   ├── api.ts           # Client-side API helper
│   │   │   └── themes.ts        # 20+ theme definitions (light & dark)
│   │   ├── layouts/             # Astro layouts
│   │   ├── pages/               # Pages & API routes
│   │   │   └── api/             # REST endpoints (lists, items, notes)
│   │   └── styles/
│   │       └── global.css       # Tailwind + theme CSS vars + TipTap styles
│   └── drizzle/                 # Database migrations
├── marketing/                   # Marketing site (Astro + React + Tailwind, static)
│   └── src/
│       ├── components/          # Navbar, Hero, Features, ThemeShowcase, Footer
│       ├── layouts/             # Astro layouts
│       ├── pages/               # Static pages
│       └── styles/              # Global styles
├── .windsurf/agents/context.md  # AI agent project context
├── Dockerfile                   # Multi-stage production Docker image
├── docker-compose.yml           # Docker Compose config with volume mount
└── package.json                 # npm workspaces root
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lists` | List all lists |
| `POST` | `/api/lists` | Create a new list |
| `GET` | `/api/lists/[id]` | Get list with items |
| `PATCH` | `/api/lists/[id]` | Update list |
| `DELETE` | `/api/lists/[id]` | Delete list and its items |
| `POST` | `/api/items` | Create item (supports `parentId` for sub-items) |
| `PATCH` | `/api/items/[id]` | Update item |
| `DELETE` | `/api/items/[id]` | Delete item |
| `GET` | `/api/notes` | List all notes |
| `POST` | `/api/notes` | Create note |
| `GET` | `/api/notes/[id]` | Get note |
| `PATCH` | `/api/notes/[id]` | Update note |
| `DELETE` | `/api/notes/[id]` | Delete note |

## Tech Stack

- **Framework**: Astro 4 with `@astrojs/node` adapter (SSR)
- **UI**: React 18 + Tailwind CSS 3
- **Database**: SQLite via better-sqlite3 (WAL mode)
- **ORM**: Drizzle ORM
- **Rich Text**: TipTap (ProseMirror) with StarterKit, Underline, Link, Placeholder
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Icons**: Lucide React
- **IDs**: nanoid
- **Deployment**: Docker (node:20-alpine)

## Themes

LISQ ships with 20+ built-in themes. Switch anytime from the sidebar.

**Light**: Paper (default), GitHub Light, Solarized Light, Catppuccin Latte, Ayu Light, Gruvbox Light

**Dark**: One Dark Pro, Dracula, GitHub Dark, Monokai Pro, Solarized Dark, Nord, Catppuccin Mocha, Tokyo Night, Gruvbox Dark, Palenight, Ayu Dark, Synthwave '84, Rosé Pine, Vitesse Dark

## Docker Build & Publish

```bash
# Log in to Docker Hub (if not already)
docker login

# Create a buildx builder (one-time setup)
docker buildx create --name lisq-builder --use

# Build and push multi-platform image
docker buildx build --platform linux/amd64,linux/arm64 \
  -t lukevinskywynn/lisq:latest \
  -t lukevinskywynn/lisq:1.0.0 \
  --push .
```

## License

MIT
