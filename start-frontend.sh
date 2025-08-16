#!/bin/bash

# Kill any existing frontend processes
echo "🔄 Stopping existing frontend processes..."
pkill -f "vite.*5002" 2>/dev/null || true
sleep 2

# Start frontend client
echo "🚀 Starting frontend client on port 5002..."
npm run dev:client
