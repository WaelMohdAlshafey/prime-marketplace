@echo off
setlocal enabledelayedexpansion

:: Go to the root of the repository (where .git is)
cd /d "%~dp0"

echo ========================================
echo 📤 Pushing whole project to GitHub...
echo ========================================

:: Get current branch name
for /f "tokens=*" %%i in ('git branch --show-current') do set "BRANCH=%%i"
echo 📌 Branch: %BRANCH%

:: Check if there are changes to commit
git status --porcelain | findstr . >nul
if %errorlevel% neq 0 (
    echo ℹ️ No changes to commit. Skipping.
    pause
    exit /b 0
)

:: Stage ALL changes from the root (includes both backend and frontend)
git add .

:: Generate timestamp for commit message
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "datetime=%%I"
set "datetime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%"

:: Commit with a descriptive message
git commit -m "Full project update (%datetime%)"

:: Push to remote
git push origin %BRANCH%

if %errorlevel% neq 0 (
    echo ❌ Git push failed.
    pause
    exit /b %errorlevel%
)

echo ========================================
echo ✅ Successfully pushed all changes!
echo ========================================
pause