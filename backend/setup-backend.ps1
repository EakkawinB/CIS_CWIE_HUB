# CIS CWIE Hub - Backend Setup Script
# This script prepares the backend for local development

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CIS CWIE Hub - Backend Setup Script   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

# Step 1: Check Python
Write-Host "`n[1/5] Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
Write-Host "      $pythonVersion" -ForegroundColor Green

# Step 2: Verify .env file
Write-Host "`n[2/5] Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "      ✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "      ❌ .env file not found!" -ForegroundColor Red
    Write-Host "      Please create .env with DATABASE_URL and other config" -ForegroundColor Red
    exit 1
}

# Step 3: Test database connection
Write-Host "`n[3/5] Testing Supabase connection..." -ForegroundColor Yellow
python test_db.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ❌ Database connection failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Install/Update dependencies
Write-Host "`n[4/5] Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "      This may take a minute..." -ForegroundColor Gray
pip install -q -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "      ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "      ⚠️  Some dependencies failed (may continue anyway)" -ForegroundColor Yellow
}

# Step 5: Summary
Write-Host "`n[5/5] Setup complete!" -ForegroundColor Yellow

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Ready to Start Backend Server          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Start Redis (if not running):"
Write-Host "      redis-server" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Start backend server:"
Write-Host "      python -m uvicorn app.main:app --reload" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Open http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "      for API documentation"
Write-Host ""
Write-Host "   4. Run health check:" -ForegroundColor Gray
Write-Host "      curl http://localhost:8000/health" -ForegroundColor Gray
Write-Host ""

Pop-Location
