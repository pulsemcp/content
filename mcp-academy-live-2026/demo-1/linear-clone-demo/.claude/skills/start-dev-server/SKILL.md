---
name: start-dev-server
description: Start the Linear Clone demo dev server (Docker Compose with PostgreSQL) to test changes or validate features locally.
user-invocable: true
---

# Start Dev Server

Start the Linear Clone demo application for local development. Handles both agent container and standalone clone environments.

## Checklist

- [ ] Detect environment (agent container vs standalone clone)
- [ ] Check if dev server is already running
- [ ] Start Docker Compose services (if standalone) or run.sh (if agent container)
- [ ] Run setup (install deps, migrate, seed)
- [ ] Wait for health check to pass
- [ ] Report status with URLs and log locations

## Pre-requisites

- [ ] Docker and Docker Compose are available (standalone clone only)
- [ ] The `linear-clone-demo/` directory exists in the repo

> **If any pre-requisite is not met, STOP immediately and tell the user.**

## Procedure

### Step 1: Detect environment

```bash
if [ -f /app/.agent-containers/run.sh ]; then
  echo "agent-container"
else
  echo "standalone-clone"
fi
```

- **Agent container**: Source code is already mounted at `/app`, database is running, deps may be installed.
- **Standalone clone**: Need to start Docker Compose from the host.

### Step 2: Check if already running

Check if the dev server is already up:

```bash
curl -sf http://localhost:3000/health
```

If the health check passes, skip to Step 5 (report status). Do not restart a healthy server.

Also check for PID files:
- Agent container: `/app/.logs/app.pid`
- Standalone: check `docker compose ps` output

### Step 3: Start services

#### Agent container path

```bash
cd /app
bash .agent-containers/setup.sh
bash .agent-containers/run.sh
```

#### Standalone clone path

Run from the `linear-clone-demo/` directory:

```bash
cd linear-clone-demo

# Start Docker Compose
docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev up -d --build

# Wait for db to be healthy
docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev exec app bash -c "until pg_isready -h db -U app 2>/dev/null; do sleep 1; done"

# Run setup inside the container
docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev exec app bash .agent-containers/setup.sh

# Start the dev server
docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev exec -d app bash .agent-containers/run.sh
```

Use `docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev port app 3000` to discover the mapped host port.

### Step 4: Wait for health check

Poll the health endpoint until it responds:

```bash
for i in $(seq 1 24); do
  if curl -sf http://localhost:${HOST_PORT}/health > /dev/null 2>&1; then
    echo "Health check passed"
    break
  fi
  sleep 5
done
```

- For agent containers, `HOST_PORT` is `3000`
- For standalone clones, discover it via `docker compose port app 3000`
- Timeout after 120 seconds (24 attempts x 5s)

If health check fails after all retries, check logs and report the error.

### Step 5: Report status

Report to the user:

- **App URL**: `http://localhost:${HOST_PORT}`
- **Health**: `http://localhost:${HOST_PORT}/health`
- **API**: `http://localhost:${HOST_PORT}/api/issues`
- **Logs**: `.logs/app.log` (agent container) or `docker compose logs` (standalone)

Example: `"Dev server running at http://localhost:32771. Health check passing. 5 seeded issues available."`

## Output

- Running Docker Compose stack with PostgreSQL and the Node.js app
- Health endpoint responding at `/health`
- Seeded database with sample issues
- Status summary with URLs

## Important

- Never use `run_in_background: true` for the docker compose or server start commands -- they need to complete in the foreground so you can check for errors.
- Always check if the server is already running before starting. Don't restart a healthy server.
- For standalone clones, always use `-p linear-clone-dev` as the compose project name for consistency.
- If the port is dynamically assigned (standalone), always discover it via `docker compose port` rather than hardcoding.
- If setup.sh or migrations fail, check if the database is ready. The `depends_on` with health check should handle this, but occasionally the first connection attempt races the readiness check.
