# CircleEd Backend API

FastAPI backend for the CircleEd peer-to-peer learning platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your database URL:
```
DATABASE_URL=postgresql://user:password@localhost:5432/circleed_db
```

For mock database (SQLite), you can use:
```
USE_MOCK_DB=true
```

4. Initialize the database:
```bash
python -m app.db.init_db
```

5. Seed the database with mock data:
```bash
python -m app.db.seed
```

6. Run the server:
```bash
python run.py
```

Or with uvicorn directly:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token

### Users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PUT /api/v1/users/me` - Update current user

### Skills
- `GET /api/v1/skills/` - List skills (with filters)
- `GET /api/v1/skills/{skill_id}` - Get skill details
- `POST /api/v1/skills/` - Create a skill
- `GET /api/v1/skills/{skill_id}/reviews` - Get skill reviews
- `POST /api/v1/skills/{skill_id}/reviews` - Create a review

### Sessions
- `GET /api/v1/sessions/` - List sessions
- `GET /api/v1/sessions/upcoming` - Get upcoming sessions
- `POST /api/v1/sessions/` - Book a session

### Transactions
- `GET /api/v1/transactions/` - Get transaction history
- `GET /api/v1/transactions/balance` - Get token balance

### Chats
- `GET /api/v1/chats/` - List chats
- `GET /api/v1/chats/{chat_id}/messages` - Get messages
- `POST /api/v1/chats/{chat_id}/messages` - Send a message

## Database

The backend supports both PostgreSQL and SQLite (for development/mocking).

To use PostgreSQL, set your `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/circleed_db
```

To use SQLite mock database:
```
USE_MOCK_DB=true
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `USE_MOCK_DB` - Use SQLite mock database (true/false)
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)
- `ENVIRONMENT` - Environment (development/production)




