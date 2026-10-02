# OpenInterviewAI - Start All Services
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   OpenInterviewAI - Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Magenta
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "Open your browser at: http://localhost:3000" -ForegroundColor Cyan
