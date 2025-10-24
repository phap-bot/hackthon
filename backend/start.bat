@echo off

REM AI Travel Planner Backend Startup Script for Windows

echo 🚀 Starting AI Travel Planner Backend...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    pause
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip is not installed. Please install pip first.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating .env file...
    copy env.example .env
    echo 📝 Please edit .env file with your API keys and configuration.
)

REM Create logs directory
if not exist "logs" mkdir logs

REM Start the application
echo 🎯 Starting FastAPI server...
echo 📖 API Documentation: http://localhost:8000/docs
echo 🔍 ReDoc Documentation: http://localhost:8000/redoc
echo 💚 Health Check: http://localhost:8000/health

uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
