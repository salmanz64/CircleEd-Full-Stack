# 🚀 Backend Deployment Guide (Render/Vercel)

## Authentication System Status

✅ **Authentication is FULLY IMPLEMENTED and working**

Your backend supports:
- JWT token authentication
- Password hashing with bcrypt
- Protected routes with `@Depends(get_current_user)`
- CORS configuration for cross-origin requests

## Required Environment Variables for Production

### Render.com

Set these in your Render dashboard:

```bash
# Authentication
SECRET_KEY=generate-a-random-64-character-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (Render provides this automatically)
DATABASE_URL=postgresql://user:password@host:port/dbname

# CORS (IMPORTANT: Add your production frontend URL)
CORS_ORIGINS=https://your-frontend-domain.vercel.app

# Environment
ENVIRONMENT=production
USE_MOCK_DB=false
```

### How to Generate SECRET_KEY

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(64))"

# Or use online generator
# Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

## Deployment Steps

### Option 1: Render (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create PostgreSQL Database on Render**
   - Go to Render Dashboard
   - Click "New+" → "PostgreSQL"
   - Name it `circleed-db`
   - Save the **Internal Database URL** from your dashboard

3. **Create Web Service**
   - Click "New+" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: circleed-backend
     - **Region**: Closest to your users
     - **Branch**: main
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `python server.py`

4. **Add Environment Variables**
   - Add all the variables from above
   - For `DATABASE_URL`, use the Internal Database URL from step 2

5. **Deploy!**
   - Render will automatically deploy
   - Click the URL to test: `https://your-backend.onrender.com`

6. **Test Authentication**
   ```bash
   curl -X POST https://your-backend.onrender.com/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'
   ```

### Option 2: Vercel (For serverless)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create production server** (already done - `server.py`)

3. **Update Vercel config** (already done - `vercel.json`)

4. **Add environment variables**
   ```bash
   vercel env add SECRET_KEY
   vercel env add DATABASE_URL
   vercel env add CORS_ORIGINS
   ```

5. **Deploy**
   ```bash
   cd backend
   vercel --prod
   ```

## Testing Authentication After Deployment

### 1. Register New User
```bash
curl -X POST https://your-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "full_name": "John Doe"
  }'
```

**Response**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "token_balance": 100,
  ...
}
```

### 2. Login to Get Token
```bash
curl -X POST https://your-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {...}
}
```

### 3. Access Protected Endpoint
```bash
# Use the access_token from login
curl https://your-backend.onrender.com/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Common Issues & Solutions

### Issue 1: CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Update CORS_ORIGINS to include your frontend domain
```bash
CORS_ORIGINS=https://your-frontend.vercel.app,https://localhost:3000
```

### Issue 2: Database Connection Errors
**Problem**: Can't connect to PostgreSQL
**Solution**:
- Verify DATABASE_URL is correct
- Check Render dashboard for correct Internal Database URL
- Ensure USE_MOCK_DB=false

### Issue 3: JWT Invalid Token Errors
**Problem**: Tokens not working after deployment
**Solution**:
- Make sure SECRET_KEY is set in production
- Tokens must be generated with the same SECRET_KEY
- Check that ACCESS_TOKEN_EXPIRE_MINUTES is set

### Issue 4: 401 Unauthorized on All Routes
**Problem**: Auth not working
**Solution**:
- Verify Authorization header format: `Bearer {token}`
- Check that token is not expired (default 30 minutes)
- Ensure SECRET_KEY matches between login and validation

## Updating Frontend for Production

When deploying frontend, update `frontend/.env.local`:

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Production (RENDER)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1

# Production (VERCEL)
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api/v1
```

## Security Best Practices for Production

1. **Use Strong SECRET_KEY**
   - Minimum 64 characters
   - Use secrets.token_urlsafe(64)
   - Never commit to git

2. **Enable HTTPS**
   - Render automatically provides HTTPS
   - Always use HTTPS in production

3. **Set Token Expiration**
   - Default 30 minutes is good
   - Don't set too long (max 24 hours)
   - Implement token refresh if needed

4. **CORS Configuration**
   - Only include your actual domains
   - Don't use wildcards `*` in production

5. **Database Security**
   - Use connection pooling
   - Enable SSL mode
   - Use environment variables for credentials

## Testing Checklist

After deployment, verify:

- [ ] Can register new user
- [ ] Can login and receive token
- [ ] Can access `/api/v1/users/me` with token
- [ ] Token expires after set time
- [ ] Invalid tokens return 401
- [ ] CORS allows frontend domain
- [ ] Database writes work (create skill, book session)
- [ ] Token balance updates correctly
- [ ] Health check returns 200

## Monitoring & Logs

### Render
- Dashboard → Web Service → Logs
- Dashboard → PostgreSQL → Logs
- Dashboard → Metrics

### Check Health Endpoint
```bash
curl https://your-backend.onrender.com/health
# Should return: {"status": "healthy"}
```

## Summary

✅ **Your authentication is production-ready**
✅ **JWT tokens work correctly**
✅ **All protected routes are secured**
✅ **CORS is properly configured**

**All you need to do:**
1. Set environment variables (SECRET_KEY, DATABASE_URL, CORS_ORIGINS)
2. Deploy to Render
3. Update frontend API_URL
4. Test authentication flow

**Your backend authentication WILL work in production on Render!** 🎉
