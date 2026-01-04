@echo off
REM CORS Testing Script for Windows
REM Replace YOUR_BACKEND_URL with your actual Render backend URL

set BACKEND_URL=https://your-backend.onrender.com
set FRONTEND_URL=https://your-frontend.vercel.app

echo 🔍 Testing CORS Configuration for %BACKEND_URL%
echo.

REM Test 1: Health Check
echo Test 1: Health Check
echo ====================
curl -X GET "%BACKEND_URL%/health" ^
  -H "Origin: %FRONTEND_URL%" ^
  -v 2>&1 | findstr /C:"HTTP" /C:"Access-Control"
echo.

REM Test 2: OPTIONS Preflight
echo Test 2: OPTIONS Preflight (Login)
echo ==================================
curl -X OPTIONS "%BACKEND_URL%/api/v1/auth/login" ^
  -H "Origin: %FRONTEND_URL%" ^
  -H "Access-Control-Request-Method: POST" ^
  -H "Access-Control-Request-Headers: Content-Type" ^
  -v 2>&1 | findstr /C:"HTTP" /C:"Access-Control"
echo.

REM Test 3: POST Login
echo Test 3: POST Login
echo ===================
curl -X POST "%BACKEND_URL%/api/v1/auth/login" ^
  -H "Origin: %FRONTEND_URL%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password\"}" ^
  -v 2>&1 | findstr /C:"HTTP" /C:"Access-Control" /C:"access_token"
echo.

echo ✅ Testing Complete!
echo.
echo If you see "Access-Control-Allow-Origin: %FRONTEND_URL%" in tests 2 and 3, CORS is working!
pause
