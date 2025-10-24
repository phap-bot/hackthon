#!/bin/bash

# AI Travel Planner Backend Startup Script

echo "🚀 Starting AI Travel Planner Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB first."
    echo "   You can use Docker: docker run -d -p 27017:27017 mongo:7.0"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp env.example .env
    echo "📝 Please edit .env file with your API keys and configuration."
fi

# Create logs directory
mkdir -p logs

# Start the application
echo "🎯 Starting FastAPI server..."
echo "📖 API Documentation: http://localhost:8000/docs"
echo "🔍 ReDoc Documentation: http://localhost:8000/redoc"
echo "💚 Health Check: http://localhost:8000/health"

uvicorn main:app --reload --host 0.0.0.0 --port 8000
