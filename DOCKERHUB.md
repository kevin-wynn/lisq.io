# LISQ

**Self-hosted lists & notes app.** A beautiful, minimal tool with rich-text notes, 20+ themes, drag & drop, sub-items, and full data ownership — all in a single SQLite file.

## Quick Start

```bash
mkdir lisq && cd lisq
```

Create a `docker-compose.yml`:

```yaml
services:
  lisq:
    image: lukevinskywynn/lisq:latest
    restart: unless-stopped
    ports:
      - "4321:4321"
    volumes:
      - ./data:/data
    environment:
      - DATABASE_PATH=/data/lisq.db
      - LISQ_USERNAME=admin
      - LISQ_PASSWORD=your_strong_password
```

Start it up:

```bash
docker compose up -d
```

Open **http://localhost:4321** and sign in with your `LISQ_USERNAME` / `LISQ_PASSWORD` credentials.

## What's Inside

A single container running the full LISQ app:

- **Astro SSR** server on the configured port (default 4321)
- **SQLite** database with WAL mode for performance
- **Auto-provisioning** — admin user is created/updated on startup from env vars
- **bcrypt** password hashing (12 rounds)

## Features

- **Lists & Checklists** — Todo lists, gear checklists, shopping lists, bug-out bags, and more
- **Two Modes** — Checklist (checkboxes, progress bar) or Inventory (bullet dots, flat list)
- **Sub-Items** — Nest items one level deep. Click any row to expand.
- **Rich Notes** — TipTap editor with bold, italic, underline, headings, lists, and hyperlinks
- **Cmd+Click Links** — ⌘+click (or Ctrl+click) links in notes to open in a new tab
- **Drag & Drop** — Reorder items with drag handles
- **20+ Themes** — Paper, Dracula, Nord, Tokyo Night, Catppuccin, Synthwave, Rosé Pine, and more
- **Priority Badges** — Critical, High, Medium, Low with color coding
- **Pin Notes** — Pin important notes to the top
- **Import Markdown** — Import .md files as lists
- **Self-Hosted** — Your data never leaves your infrastructure

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `LISQ_USERNAME` | No | — | Admin username. Set with `LISQ_PASSWORD` to enable auth. |
| `LISQ_PASSWORD` | No | — | Admin password (bcrypt hashed, auto-updated if changed) |
| `DATABASE_PATH` | No | `/data/lisq.db` | SQLite file path inside the container |
| `PORT` | No | `4321` | Server port |
| `HOST` | No | `0.0.0.0` | Server bind address |

> **Auth is optional.** If `LISQ_USERNAME` and `LISQ_PASSWORD` are not set, the app runs without authentication (open access). Set both to enable login.

## Custom Port

```yaml
services:
  lisq:
    image: lukevinskywynn/lisq:latest
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - LISQ_USERNAME=admin
      - LISQ_PASSWORD=your_password
    volumes:
      - ./data:/data
```

## Custom Data Location

```bash
# Store on a NAS
docker run -d -p 4321:4321 \
  -v /mnt/nas/lisq:/data \
  -e LISQ_USERNAME=admin \
  -e LISQ_PASSWORD=secret \
  lukevinskywynn/lisq:latest
```

## Common Commands

```bash
docker compose up -d                                    # Start
docker compose down                                     # Stop
docker compose pull && docker compose up -d             # Update to latest
docker compose logs -f lisq                             # View logs
docker compose restart lisq                             # Restart
cp ./data/lisq.db ./data/lisq.db.backup                # Backup database
```

## Tech Stack

- **Framework**: Astro 4 + React 18 + Tailwind CSS 3
- **Database**: SQLite via better-sqlite3 (WAL mode)
- **ORM**: Drizzle ORM
- **Rich Text**: TipTap (ProseMirror)
- **Auth**: bcryptjs (12 rounds) + cookie sessions
- **Base Image**: node:20-alpine

## Links

- **Source** — [github.com/kevin-wynn/lisq.io](https://github.com/kevin-wynn/lisq.io)
- **Website** — [lisq.io](https://lisq.io)
