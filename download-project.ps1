# ================================================================
# PRIME MARKETPLACE – FULL PROJECT DOWNLOAD & SETUP SCRIPT
# ================================================================

# --- CONFIGURATION ---
$RepoUrl = "https://github.com/WaelMohdAlshafey/prime-marketplace.git"
$TargetDir = "M:\source"
$RepoName = "prime-marketplace"  # folder name inside $TargetDir

# --- STEP 1: Create target folder ---
Write-Host "📁 Creating target directory: $TargetDir" -ForegroundColor Cyan
if (!(Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

# --- STEP 2: Clone the repository ---
Write-Host "🔄 Cloning repository from $RepoUrl ..." -ForegroundColor Cyan
Set-Location $TargetDir

if (Test-Path $RepoName) {
    Write-Host "⚠️  Folder '$RepoName' already exists. Pulling latest changes..." -ForegroundColor Yellow
    Set-Location $RepoName
    git pull
} else {
    git clone $RepoUrl $RepoName
    Set-Location $RepoName
}

# --- STEP 3: Restore Backend Dependencies ---
Write-Host "`n📦 Restoring .NET dependencies..." -ForegroundColor Cyan
$slnFile = Get-ChildItem -Filter "*.sln" | Select-Object -First 1
if ($slnFile) {
    dotnet restore $slnFile.FullName
    Write-Host "✅ .NET dependencies restored." -ForegroundColor Green
} else {
    Write-Host "⚠️  No .sln file found. Restoring each project individually..." -ForegroundColor Yellow
    Get-ChildItem -Directory -Filter "Marketplace.*" | ForEach-Object {
        Push-Location $_.FullName
        dotnet restore
        Pop-Location
    }
}

# --- STEP 4: Restore Frontend Dependencies ---
$frontendPath = Join-Path (Get-Location) "marketplace-frontend"
if (Test-Path $frontendPath) {
    Write-Host "`n📦 Restoring frontend dependencies..." -ForegroundColor Cyan
    Set-Location $frontendPath
    npm install
    Write-Host "✅ Frontend dependencies restored." -ForegroundColor Green
} else {
    Write-Host "⚠️  marketplace-frontend folder not found. Skipping npm install." -ForegroundColor Yellow
}

# --- STEP 5: Build Backend (optional) ---
Write-Host "`n🔨 Building backend..." -ForegroundColor Cyan
if ($slnFile) {
    dotnet build $slnFile.FullName --configuration Debug
} else {
    Get-ChildItem -Directory -Filter "Marketplace.*" | ForEach-Object {
        Push-Location $_.FullName
        dotnet build --configuration Debug
        Pop-Location
    }
}

# --- STEP 6: Build Frontend (optional) ---
if (Test-Path $frontendPath) {
    Write-Host "`n🔨 Building frontend..." -ForegroundColor Cyan
    Set-Location $frontendPath
    npm run build
}

# --- STEP 7: Print instructions ---
Write-Host "`n✅ All done!" -ForegroundColor Green
Write-Host "📌 Project location: $TargetDir\$RepoName" -ForegroundColor White
Write-Host ""
Write-Host "To run the backend:"
Write-Host "  cd $TargetDir\$RepoName\Marketplace.API"
Write-Host "  dotnet run"
Write-Host ""
Write-Host "To run the frontend:"
Write-Host "  cd $TargetDir\$RepoName\marketplace-frontend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Make sure your database connection string in appsettings.Development.json is correct."
Write-Host "Enjoy! 🚀" -ForegroundColor Cyan