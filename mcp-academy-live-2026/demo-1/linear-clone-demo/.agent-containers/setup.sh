#!/bin/bash
set -e

echo "==> Installing dependencies..."
cd /app
npm install

echo "==> Running database migrations..."
npm run migrate

echo "==> Seeding database..."
npm run seed

echo "==> Setup complete!"
