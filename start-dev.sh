#!/bin/bash

# CircleEd Full Stack - Quick Start Script

echo ""
echo "========================================"
echo "  CircleEd Full Stack - Quick Start"
echo "========================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Setup trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting CircleEd Backend..."
cd backend
python run.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting CircleEd Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Servers Starting..."
echo "========================================"
echo ""
echo "Backend API:  http://localhost:8000"
echo "Frontend:     http://localhost:3000"
echo "API Docs:     http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
