#!/bin/bash

# Kill any existing processes
echo "🔄 Stopping existing processes..."
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "vite.*5001" 2>/dev/null || true
sleep 3

# Start backend in background
echo "🚀 Starting backend server on port 8001..."
PORT=8001 NODE_ENV=development npx tsx server/index.ts &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend client on port 5001..."
npm run dev:client &
FRONTEND_PID=$!

echo "✅ Both services started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend: http://localhost:8001"
echo "Frontend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on exit
trap cleanup EXIT

# Wait for any process to finish
wait
