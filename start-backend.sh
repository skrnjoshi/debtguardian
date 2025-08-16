#!/bin/bash

# Kill any existing processes
echo "🔄 Stopping existing backend processes..."
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Start backend server
echo "🚀 Starting backend server on port 8001..."
PORT=8001 NODE_ENV=development npx tsx server/index.ts
