# 🚀 CircleEd Full Stack - Getting Started

## Prerequisites Checklist

Before running the application, ensure you have:

- [ ] Python 3.8 or higher installed
- [ ] Node.js 16+ and npm installed
- [ ] PostgreSQL installed and running
- [ ] Git installed (optional)

## Step 1: Database Setup

```bash
# Start PostgreSQL (if not already running)

# Connect to PostgreSQL
psql -U postgres

# Create the database (if not exists)
CREATE DATABASE circleed;

# Exit psql
\q
```

## Step 2: Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Check the .env file
# Make sure DATABASE_URL is correct:
# DATABASE_URL=postgresql://postgres:salman%401205@localhost:5432/circleed
```

## Step 3: Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Check the .env.local file
# Should contain:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Step 4: Start the Servers

### Option A: Quick Start (Windows)
In the project root directory:
```bash
start-dev.bat
```

### Option B: Quick Start (Linux/Mac)
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option C: Manual Start
**Terminal 1:**
```bash
cd backend
python run.py
```

**Terminal 2 (new terminal window):**
```bash
cd frontend
npm run dev
```

## Access Your Application

Once both servers are running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main web application |
| Backend API | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger UI documentation |
| ReDoc | http://localhost:8000/redoc | Alternative API docs |
| Health Check | http://localhost:8000/health | API health status |

## Test the Integration

1. **Open Frontend**: Go to http://localhost:3000
2. **Navigate to Marketplace**: Click on "Marketplace" in the sidebar
3. **Verify Data Loading**: You should see skills loaded from the database
4. **Check Dashboard**: Go to Dashboard to see user information

## Troubleshooting

### Backend won't start
```
Error: Port 8000 already in use
Solution: Change port in backend/run.py or stop the service using port 8000
```

### Frontend shows API errors
```
Error: Failed to fetch from API
Solution: 
1. Check backend is running on http://localhost:8000
2. Check frontend .env.local has correct API_URL
3. Check CORS in backend .env includes http://localhost:3000
```

### Database connection error
```
Error: could not connect to server: Connection refused
Solution:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in backend/.env
3. Verify circleed database exists
```

## Project Structure

```
CircleEd-Full-Stack/
├── backend/               # FastAPI server
│   ├── app/              # Application code
│   │   ├── api/          # API routes
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Data schemas
│   │   └── core/         # Configuration
│   ├── run.py            # Start server
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/             # Next.js application
│   ├── app/             # App routes
│   ├── components/      # React components
│   ├── lib/             # Utilities and API
│   ├── package.json     # Dependencies
│   └── .env.local       # Environment variables
├── start-dev.bat        # Windows quick start
└── start-dev.sh         # Linux/Mac quick start
```

## Common Commands

### Backend
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server
python run.py

# Initialize database
python -m app.db.init_db

# Seed database with sample data
python -m app.db.seed
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:salman%401205@localhost:5432/circleed
USE_MOCK_DB=false
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
ENVIRONMENT=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## API Endpoints Available

```
GET  /api/v1/skills                    - List skills
GET  /api/v1/skills/{id}               - Get skill details
POST /api/v1/skills                    - Create skill

GET  /api/v1/users/me                  - Get current user
GET  /api/v1/users/{id}                - Get user by ID
PUT  /api/v1/users/me                  - Update user

GET  /api/v1/sessions                  - List sessions
GET  /api/v1/sessions/upcoming         - Get upcoming sessions
POST /api/v1/sessions                  - Book session

GET  /api/v1/chats                     - List chats
GET  /api/v1/chats/{id}/messages       - Get messages
POST /api/v1/chats/{id}/messages       - Send message

GET  /api/v1/transactions              - Get transactions
GET  /api/v1/transactions/balance      - Get balance

POST /api/v1/auth/register             - Register user
POST /api/v1/auth/login                - Login user
```

## Features Implemented

✅ Database connection (PostgreSQL)  
✅ API service layer (lib/api.ts)  
✅ Skills marketplace with real data  
✅ User dashboard with real data  
✅ Loading states  
✅ Error handling  
✅ CORS enabled  
✅ TypeScript support  

## Next Steps

After getting everything running:

1. Test API endpoints at http://localhost:8000/docs
2. Explore the Marketplace page
3. Check the Dashboard
4. Review the `INTEGRATION_SETUP.md` for detailed documentation
5. Start implementing features like authentication

## Need Help?

1. Check the `INTEGRATION_SETUP.md` file for detailed documentation
2. Review API documentation at http://localhost:8000/docs
3. Check browser console for JavaScript errors
4. Check terminal for backend errors
5. Verify all environment variables are set correctly

---

**Ready to start? Run `start-dev.bat` (Windows) or `./start-dev.sh` (Mac/Linux)!** 🚀
