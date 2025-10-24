#!/bin/bash

echo "Starting AI Travel Planner Backend..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.11+ and try again"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo
    echo "IMPORTANT: Please edit .env file and add your API keys:"
    echo "- OPENAI_API_KEY (required for AI features)"
    echo "- GOOGLE_MAPS_API_KEY (required for maps)"
    echo "- SERPAPI_API_KEY (optional, for enhanced search)"
    echo
    read -p "Press Enter to continue..."
fi

# Create logs directory
mkdir -p logs

# Start the application
echo "Starting FastAPI server..."
echo
echo "Backend will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop the server"
echo

uvicorn main:app --reload --host 0.0.0.0 --port 8000
