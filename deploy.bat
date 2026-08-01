@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 🔨 Building Backend (Marketplace.API)
echo ========================================
cd /d M:\Marketplace\Marketplace.API
dotnet build --configuration Release
if %errorlevel% neq 0 (
    echo ❌ Backend build failed. Deployment aborted.
    pause
    exit /b %errorlevel%
)

echo ========================================
echo 🔨 Building Frontend (marketplace-frontend)
echo ========================================
cd /d M:\Marketplace\marketplace-frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed. Deployment aborted.
    pause
    exit /b %errorlevel%
)

echo ========================================
echo ✅ Build successful. Deploying to GitHub...
echo ========================================

cd /d M:\Marketplace

:: Get current branch name
for /f "tokens=*" %%i in ('git branch --show-current') do set "BRANCH=%%i"
echo 📌 Current branch: %BRANCH%

:: Get current date/time for commit message
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "datetime=%%I"
set "datetime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%"

:: Stage all changes
git add .

:: Commit
git commit -m "Auto-deploy: build successful (%datetime%)"

:: Push
git push origin %BRANCH%

if %errorlevel% neq 0 (
    echo ❌ Git push failed.
    pause
    exit /b %errorlevel%
)

echo ========================================
echo ✅ Deployment completed successfully!
echo ========================================
pause