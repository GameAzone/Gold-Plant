@echo off
echo ========================================
echo AL EBREIZ - Building for Production
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

:: Clean previous build
if exist "dist\" (
    echo Cleaning previous build...
    rmdir /s /q dist
)

:: Build the project
echo Building production bundle...
call npm run build

:: Check if build was successful
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Build successful!
    echo ========================================
    echo.
    echo Files ready for deployment in: .\dist\
    echo.
    echo Next Steps:
    echo 1. Open FileZilla or Hostinger File Manager
    echo 2. Upload ALL files from '.\dist\' folder to 'public_html/'
    echo 3. Upload '.htaccess' file to 'public_html/'
    echo 4. Upload app icons to 'public_html/icons/'
    echo 5. Enable SSL in Hostinger panel
    echo.
    echo Full guide: See HOSTINGER_DEPLOYMENT_GUIDE.md
    echo.
) else (
    echo.
    echo Build failed! Please check the errors above.
    exit /b 1
)

pause
