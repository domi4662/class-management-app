#!/bin/bash

echo "🚀 Starting Class Management App in development mode..."

# Check if MongoDB is running locally
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running locally."
    echo "   You can either:"
    echo "   1. Start MongoDB locally: mongod"
    echo "   2. Use MongoDB Atlas (update backend/.env)"
    echo ""
fi

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found."
    echo "   Copy backend/.env.example to backend/.env and update values"
    echo ""
fi

echo "📦 Installing dependencies..."
npm run install:all

echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting for backend to start..."
sleep 5

echo "🌐 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📋 Useful commands:"
echo "   - View backend logs: cd backend && npm run dev"
echo "   - View frontend logs: npm run dev"
echo "   - Stop all servers: pkill -f 'npm run dev'"
echo ""
echo "🔄 Both servers will restart automatically on file changes"
echo ""

# Wait for user to stop
echo "Press Ctrl+C to stop all servers..."
wait 