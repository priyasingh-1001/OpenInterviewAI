Write-Host "Starting FastAPI backend on http://localhost:8000 ..." -ForegroundColor Magenta
Set-Location "$PSScriptRoot\backend"
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
