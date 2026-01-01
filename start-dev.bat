@echo off
REM CircleEd Full Stack - Quick Start Script

echo.
echo ========================================
echo   CircleEd Full Stack - Quick Start
echo ========================================
echo.

REM Check if backend port is available
echo Starting CircleEd Backend...
echo.

REM Start backend in a new window
start "CircleEd Backend" cmd /k "cd backend && python run.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in a new window
start "CircleEd Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend API:  http://localhost:8000
echo Frontend:     http://localhost:3000
echo API Docs:     http://localhost:8000/docs
echo.
echo Press Ctrl+C in either window to stop
echo.
