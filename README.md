# CircleEd - Peer-to-Peer Learning Platform

A modern full-stack web application for peer-to-peer skill exchange using tokens.

## Tech Stack

### Frontend
- **Next.js 15+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **ShadCN UI** components
- **Zustand** for state management
- **NextAuth** for authentication (placeholder)
- **React Hook Form + Zod** for forms
- **Lucide Icons**

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Production database (with SQLite mock option)
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **JWT** - Authentication tokens

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. For mock database (SQLite), set in `.env`:
```
USE_MOCK_DB=true
```

For PostgreSQL, set your database URL:
```
DATABASE_URL=postgresql://user:password@localhost:5432/circleed_db
USE_MOCK_DB=false
```

6. Initialize and seed the database:
```bash
python -m app.db.init_db
python -m app.db.seed
```

7. Run the backend server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
/frontend            # Next.js frontend
  /app               # Next.js app directory
    /(auth)          # Authentication pages
    /(dashboard)     # Protected dashboard pages
  /components        # React components
  /data              # (mock data removed — frontend uses backend APIs)
  /lib               # Utility functions
  package.json       # Frontend dependencies
  tsconfig.json      # TypeScript configuration
  tailwind.config.ts # Tailwind CSS configuration

/backend             # FastAPI backend
  /app
    /api            # API routes
    /core           # Core configuration
    /models         # Database models
    /schemas        # Pydantic schemas
    /db             # Database initialization
  requirements.txt   # Python dependencies
  run.py            # Backend server entry point
```

## Features

### Frontend
- ✅ User authentication (UI)
- ✅ Dashboard with stats and quick actions
- ✅ Skill marketplace with filtering
- ✅ Skill profile pages with reviews
- ✅ Chat interface
- ✅ Token wallet and transaction history
- ✅ User profile management
- ✅ Settings page

### Backend
- ✅ FastAPI REST API
- ✅ PostgreSQL/SQLite database support
- ✅ User authentication with JWT
- ✅ Skills CRUD operations
- ✅ Session booking system
- ✅ Transaction management
- ✅ Chat and messaging
- ✅ Mock data seeding
- ✅ CORS configuration

## Design Principles

- Clean, modern UI with soft gradient tones
- Spacing priority (not cluttered)
- Responsive (mobile-first)
- Card-based UI with subtle shadows
- Consistent typography scale
- Accent color: #6366F1 (indigo)

## API Endpoints

See [backend/README.md](backend/README.md) for complete API documentation.

Main endpoints:
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/skills/` - List skills
- `GET /api/v1/skills/{id}` - Get skill details
- `POST /api/v1/sessions/` - Book session
- `GET /api/v1/transactions/` - Get transactions
- `GET /api/v1/chats/` - Get chats

## Next Steps

- Connect frontend to backend API
- Implement JWT authentication in frontend
- Add real-time chat with WebSockets
- Add payment processing for tokens
- Deploy to production

