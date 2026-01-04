# 🔧 CORS 400 Bad Request Fix

## Problem
```
OPTIONS /api/v1/auth/login HTTP/1.1 400 Bad Request
```

This happens when CORS preflight requests are rejected. The browser sends an OPTIONS request before POST, and it's being rejected.

## Solution

### Step 1: Fix CORS Configuration (DONE)

✅ Updated `backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

### Step 2: Set CORS_ORIGINS in Render

**CRITICAL**: You MUST set `CORS_ORIGINS` environment variable in Render.

#### Go to: Render Dashboard → Your Service → Environment

Add this environment variable:
```bash
CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://localhost:3000
```

**Important**: 
- Replace `your-frontend-domain.vercel.app` with your ACTUAL frontend URL
- Include all domains that will access your backend
- Separate multiple domains with commas (NO spaces)
- Do NOT use `["https://..."]` with brackets - just the URLs

### Step 3: Common CORS_ORIGINS Examples

```bash
# If frontend is on Vercel
CORS_ORIGINS=https://circleed.vercel.app

# If you have multiple environments
CORS_ORIGINS=https://circleed.vercel.app,https://staging-circleed.vercel.app

# If you want to allow localhost for testing
CORS_ORIGINS=https://circleed.vercel.app,http://localhost:3000

# ALLOW ALL (not recommended for production)
CORS_ORIGINS=*
```

### Step 4: Restart Your Render Service

1. Go to Render Dashboard → Your Service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete
4. Check logs for: `✅ CORS Origins configured: [...]`

### Step 5: Test CORS Preflight

```bash
# Test OPTIONS request (preflight)
curl -X OPTIONS https://your-backend.onrender.com/api/v1/auth/login \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should return 200 OK with these headers:
# Access-Control-Allow-Origin: https://your-frontend.vercel.app
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
# Access-Control-Allow-Headers: *
# Access-Control-Allow-Credentials: true
```

### Step 6: Test Actual Login

```bash
curl -X POST https://your-backend.onrender.com/api/v1/auth/login \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Troubleshooting

### Issue 1: Still getting 400 Bad Request

**Check Render Logs:**
```
Render → Service → Logs
```

**Look for:**
```
✅ CORS Origins configured: [https://your-frontend.vercel.app]
```

If you see:
```
⚠️  No CORS_ORIGINS set - allowing all origins for development
```

This means CORS_ORIGINS is empty in environment variables.

### Issue 2: CORS Origins Empty

**Fix:**
1. Go to Render Dashboard → Service → Environment
2. Add: `CORS_ORIGINS=https://your-actual-frontend-url`
3. Click "Save Changes"
4. Redeploy service

### Issue 3: Frontend URL Mismatch

**Common mistakes:**
- ❌ `CORS_ORIGINS=["https://myapp.vercel.app"]` (brackets not allowed)
- ✅ `CORS_ORIGINS=https://myapp.vercel.app` (correct)

- ❌ `CORS_ORIGINS=https://myapp.vercel.app, https://other.com` (spaces)
- ✅ `CORS_ORIGINS=https://myapp.vercel.app,https://other.com` (no spaces)

- ❌ `CORS_ORIGINS=myapp.vercel.app` (missing https://)
- ✅ `CORS_ORIGINS=https://myapp.vercel.app` (include https://)

### Issue 4: Still Not Working After Setting CORS_ORIGINS

**Try this debug approach:**

1. Set `CORS_ORIGINS=*` in Render (temporary, for debugging)
2. Redeploy
3. Test if it works
4. If it works with `*`, the issue was your specific domain
5. If it still doesn't work with `*`, there's another issue

### Issue 5: Browser-Specific Issues

**Chrome:** Sometimes caches CORS headers. Try:
```
1. Clear cache
2. Open Incognito mode
3. Test again
```

**Firefox/Edge:** Same - clear cache and try Incognito/Private mode.

## Verification Checklist

After applying fixes:

- [ ] `CORS_ORIGINS` environment variable is set in Render
- [ ] CORS_ORIGINS includes your frontend URL
- [ ] No spaces or brackets in CORS_ORIGINS
- [ ] Service has been redeployed
- [ ] Logs show configured CORS origins
- [ ] OPTIONS request returns 200 OK
- [ ] Login works in browser

## Complete Environment Variables for Render

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Authentication
SECRET_KEY=<your-64-char-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (IMPORTANT!)
CORS_ORIGINS=https://your-frontend.vercel.app

# Environment
ENVIRONMENT=production
USE_MOCK_DB=false
```

## Quick Fix: Allow All Origins (Not Recommended for Production)

If you want to bypass CORS issues temporarily:

```bash
# In Render Environment Variables:
CORS_ORIGINS=*
```

**Warning:** This allows any website to access your API. Only use for testing.

## Next Steps

1. ✅ CORS configuration updated in `main.py`
2. ⚠️ Set `CORS_ORIGINS` in Render Environment
3. ⚠️ Restart/Redeploy service
4. ⚠️ Test with curl first
5. ⚠️ Test in browser

## Test Commands

```bash
# Test preflight
curl -X OPTIONS https://your-backend.onrender.com/api/v1/auth/login \
  -H "Origin: https://circleed.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test actual request
curl -X POST https://your-backend.onrender.com/api/v1/auth/login \
  -H "Origin: https://circleed.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Expected Behavior After Fix

**Browser Console:**
```
✅ No CORS errors
```

**Render Logs:**
```
✅ CORS Origins configured: ['https://circleed.vercel.app']
INFO:     116.68.99.46:0 - "OPTIONS /api/v1/auth/login HTTP/1.1" 200 OK
INFO:     116.68.99.46:0 - "POST /api/v1/auth/login HTTP/1.1" 200 OK
```

**Response:**
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {...}
}
```

---

## Summary

The 400 Bad Request on OPTIONS is a **CORS configuration issue**.

**Fix:**
1. ✅ Updated CORS middleware in `main.py`
2. ⚠️ **YOU MUST** set `CORS_ORIGINS` in Render Environment Variables
3. ⚠️ Redeploy service
4. ⚠️ Test with curl command above

**Most common mistake:** Not setting `CORS_ORIGINS` environment variable in Render.
