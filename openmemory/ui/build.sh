#!/bin/bash
set -e

echo "Installing pnpm..."
npm install -g pnpm

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building project..."
pnpm build

echo "Build complete!"