@echo off
echo.
echo =========================================
echo    OpenInterviewAI - Starting Services
echo =========================================
echo.
echo  Frontend  -> http://localhost:3000
echo  Backend   -> http://localhost:8000
echo  API Docs  -> http://localhost:8000/docs
echo.

start "Backend - FastAPI" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2 /nobreak > nul
start "Frontend - Next.js" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Open your browser: http://localhost:3000
echo.
pause
