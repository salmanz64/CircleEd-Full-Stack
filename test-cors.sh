#!/bin/bash

# CORS Testing Script
# Replace YOUR_BACKEND_URL with your actual Render backend URL

BACKEND_URL="https://your-backend.onrender.com"
FRONTEND_URL="https://your-frontend.vercel.app"

echo "🔍 Testing CORS Configuration for $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "===================="
curl -X GET "$BACKEND_URL/health" \
  -H "Origin: $FRONTEND_URL" \
  -v 2>&1 | grep -E "(HTTP|Access-Control)"
echo ""

# Test 2: OPTIONS Preflight
echo "Test 2: OPTIONS Preflight (Login)"
echo "=================================="
curl -X OPTIONS "$BACKEND_URL/api/v1/auth/login" \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -E "(HTTP|Access-Control)"
echo ""

# Test 3: POST Login
echo "Test 3: POST Login"
echo "==================="
curl -X POST "$BACKEND_URL/api/v1/auth/login" \
  -H "Origin: $FRONTEND_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -v 2>&1 | grep -E "(HTTP|Access-Control|access_token)"
echo ""

# Test 4: Register
echo "Test 4: Register"
echo "==============="
curl -X POST "$BACKEND_URL/api/v1/auth/register" \
  -H "Origin: $FRONTEND_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}' \
  -v 2>&1 | grep -E "(HTTP|Access-Control)"
echo ""

echo "✅ Testing Complete!"
echo ""
echo "If you see 'Access-Control-Allow-Origin: $FRONTEND_URL' in tests 2 and 3, CORS is working!"
