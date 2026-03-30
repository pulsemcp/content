# Deployment Guide

## Architecture

```
+-------------------------------------------------+
|  DigitalOcean Droplet (s-1vcpu-1gb, Ubuntu 24.04) |
|  IP: 24.199.97.28          Region: SFO3          |
|                                                   |
|  +-------------+  +------------+  +------------+ |
|  |  PostgreSQL |  |  Backend   |  |  Frontend   | |
|  |  (postgres: |  |  (Node.js  |  |  (Vite dev  | |
|  |  16-alpine) |  |   + Express|  |   server +  | |
|  |             |  |   :3001)   |  |   React)    | |
|  |  :5432      |  |            |  |  :5173      | |
|  +------+------+  +-----+------+  +------+------+ |
|         |               |                |        |
|         +--health check-+   /api proxy --+        |
|                                                   |
|  Docker Compose network (linear-clone_default)    |
+-------------------------------------------------+
         |
         | :5173 (public)
         v
    Users' browsers
```

### Components

| Service | Image | Port (host:container) | Purpose |
|---------|-------|-----------------------|---------|
| **db** | `postgres:16-alpine` | 5433:5432 | PostgreSQL database with persistent volume |
| **backend** | Built from `./backend/Dockerfile` | 3001:3001 | Express.js REST API (Node 20) |
| **frontend** | Built from `./frontend/Dockerfile` | 5173:5173 | Vite dev server with React, proxies `/api` to backend |

### How requests flow

1. Browser hits `http://<DROPLET_IP>:5173`
2. Vite serves the React SPA for non-API routes
3. Requests to `/api/*` are proxied by Vite to `http://backend:3001` (Docker internal DNS)
4. Backend queries PostgreSQL at `db:5432` using the `pg` connection pool
5. Database auto-migrates on backend startup (creates `issues` table, seeds sample data if empty)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | List all issues |
| GET | `/api/issues/:id` | Get a single issue |
| POST | `/api/issues` | Create an issue |
| PATCH | `/api/issues/:id` | Update an issue |
| DELETE | `/api/issues/:id` | Delete an issue |

## Prerequisites

- SSH access to the droplet (key-based auth)
- `rsync` installed locally
- Bash shell

## Deploying

### First-time setup

The deploy script handles everything automatically on first run:
- Creates 1GB swap (needed for Docker builds on the 1GB droplet)
- Installs Docker Engine and Docker Compose plugin
- Creates the app directory at `/opt/linear-clone`

### Running a deployment

```bash
./deploy.sh
```

The script:
1. SSHs into the droplet and ensures Docker is installed
2. Rsyncs the local code (excluding `node_modules`, `.git`, `dist`) to `/opt/linear-clone`
3. Runs `docker compose up -d --build` to build images and start containers
4. Reports the public URL on completion

### Redeployment

Just run `./deploy.sh` again. It will:
- Skip Docker installation (already present)
- Rsync only changed files
- Rebuild only changed Docker layers
- Restart containers with zero-downtime replacement

## Infrastructure Details

| Property | Value |
|----------|-------|
| Provider | DigitalOcean |
| Droplet ID | 561699910 |
| Droplet name | `linear-clone` |
| Size | s-1vcpu-1gb (1 vCPU, 1GB RAM, 25GB disk) |
| Region | SFO3 (San Francisco) |
| OS | Ubuntu 24.04 LTS |
| Public IP | 24.199.97.28 |
| App URL | http://24.199.97.28:5173 |
| App directory | `/opt/linear-clone` |
| Docker volume | `linear-clone_pgdata` (persistent DB storage) |

## Troubleshooting

### Check container status

```bash
ssh root@24.199.97.28 "cd /opt/linear-clone && docker compose ps"
```

### View logs

```bash
# All services
ssh root@24.199.97.28 "cd /opt/linear-clone && docker compose logs"

# Specific service
ssh root@24.199.97.28 "cd /opt/linear-clone && docker compose logs backend"
ssh root@24.199.97.28 "cd /opt/linear-clone && docker compose logs frontend"
ssh root@24.199.97.28 "cd /opt/linear-clone && docker compose logs db"
```

### Restart services

```bash
ssh root@24.199.97.28 "cd /opt/linear-clone && docker compose restart"
```

### Full rebuild (nuclear option)

```bash
ssh root@24.199.97.28 "cd /opt/linear-clone && docker compose down -v && docker compose up -d --build"
```

Note: `-v` removes the database volume, so all data will be lost and re-seeded.
