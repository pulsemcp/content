# Demo 1: Fixing a UI Bug with Playwright MCP

Linear clone app used to demonstrate an agent fixing a UI bug autonomously using the Playwright MCP server.

## Prerequisites

- Node.js >= 16
- PostgreSQL running locally

## Setup

```bash
cd linear-clone-demo

# Create the database
createdb linear_clone_dev

# Install dependencies
npm install

# Run migrations
npm run migrate

# Seed sample data
npm run seed

# Start the dev server (with file watching)
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment

Set `DATABASE_URL` to override the default local connection string:

```bash
export DATABASE_URL="postgresql://app:password@localhost:5432/linear_clone_dev"
```
