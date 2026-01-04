# 🎓 CircleEd - Peer-to-Peer Learning Platform

<div align="center">

![CircleEd](https://img.shields.io/badge/CircleEd-Learning%20Exchange-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js&style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?logo=fastapi&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?logo=typescript&style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

[![GitHub issues](https://img.shields.io/github/issues/salmanshahid/CircleEd-Full-Stack)](https://github.com/salmanshahid/CircleEd-Full-Stack/issues)
[![GitHub forks](https://img.shields.io/github/forks/salmanshahid/CircleEd-Full-Stack)](https://github.com/salmanshahid/CircleEd-Full-Stack/network/members)
[![GitHub stars](https://img.shields.io/github/stars/salmanshahid/CircleEd-Full-Stack)](https://github.com/salmanshahid/CircleEd-Full-Stack/stargazers)

*A modern full-stack platform for skill exchange through token-based economy*

[Features](#-features) • [Screenshots](#-screenshots) • [Demo](#-live-demo) • [Installation](#-quick-start)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Home Page
![Home Page](./screenshots/home.png)
*Landing page with hero section, features showcase, and testimonials*

### 📊 Dashboard
![Dashboard](./screenshots/dashboard.png)
*User dashboard showing learning stats, upcoming sessions, and recent activity*

### 🛒 Skill Marketplace
![Marketplace](./screenshots/marketplace.png)
*Browse and search through available skills with advanced filtering by category, level, and language*

### 📖 Skill Detail Page
![Skill Detail](./screenshots/skill-detail.png)
*View skill details, teacher profile, reviews, ratings, and book sessions*

### 💬 Chat System
![Chat](./screenshots/chat.png)
*Real-time messaging with teachers and students with unread message indicators*

### 🎓 My Skills (Teach)
![Teach](./screenshots/teach.png)
*Create and manage your teaching skills with pricing and availability*

### 📅 Bookings
![Bookings](./screenshots/bookings.png)
*Track your scheduled sessions, accept/decline requests, and manage bookings*

### 👤 Profile Page
![Profile](./screenshots/profile.png)
*Manage your profile, skills, bio, and learning preferences*

### 💰 Wallet
![Wallet](./screenshots/wallet.png)
*View token balance, transaction history, earnings, and spending analytics*

</div>

---

## 🌟 About

**CircleEd** is a peer-to-peer learning platform where users can exchange skills using a token-based economy. Learn new skills by spending tokens, or teach others to earn tokens - creating a sustainable learning ecosystem.

### 💡 Key Concept
- **Teach** → Earn tokens
- **Learn** → Spend tokens
- **Grow** → Build a learning portfolio

### 🎯 Perfect For
- Students looking to learn new skills
- Professionals wanting to share expertise
- Communities of peer learners
- Skill exchange programs

---

## ✨ Features

### 🎓 Learning Experience
- ✅ **Browse Marketplace** - Discover skills across categories
- ✅ **Advanced Search** - Filter by category, level, language
- ✅ **Teacher Profiles** - View reviews, ratings, and experience
- ✅ **Skill Reviews** - Read feedback from other students
- ✅ **Session Booking** - Schedule one-on-one learning sessions
- ✅ **Token System** - Earn tokens by teaching, spend to learn

### 👨‍🏫 Teaching Experience
- ✅ **Create Skills** - List skills you want to teach
- ✅ **Set Availability** - Define your schedule and time slots
- ✅ **Manage Bookings** - Accept, decline, or cancel sessions
- ✅ **Track Earnings** - See tokens earned from teaching
- ✅ **Receive Reviews** - Build your teaching reputation

### 💬 Communication
- ✅ **Real-time Chat** - Message students and teachers
- ✅ **Chat History** - Access all conversations
- ✅ **Notifications** - Get alerts for new messages
- ✅ **Unread Counters** - Never miss important messages

### 🔐 Authentication & Security
- ✅ **JWT Auth** - Secure token-based authentication (fully implemented!)
- ✅ **Password Hashing** - Bcrypt encryption for security
- ✅ **Protected Routes** - All dashboard pages require login
- ✅ **Auto-Redirect** - Seamless login/logout flow
  - Redirect to dashboard if logged in
  - Redirect to login if not logged in

### 📊 Analytics & Tracking
- ✅ **Learning Streak** - Track consecutive learning days
- ✅ **Token Balance** - View current tokens and transactions
- ✅ **Transaction History** - Complete record of token movements
- ✅ **Dashboard Stats** - Overview of learning journey

### 🎨 User Experience
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Modern UI** - Clean, gradient-based design
- ✅ **Toast Notifications** - Real-time feedback for actions
- ✅ **Loading States** - Skeletons and spinners
- ✅ **Error Handling** - Graceful error messages

---

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?logo=tailwind-css&logoColor=white)
![ShadCN UI](https://img.shields.io/badge/ShadCN-black?logo=shadcn-ui&logoColor=white)

**Framework & Core:**
- Next.js 15 (App Router)
- React 18.3
- TypeScript 5.3

**Styling:**
- Tailwind CSS 3.4
- ShadCN UI Components
- Lucide React Icons

**State & Forms:**
- React Hooks (useState, useEffect)
- Custom useAuthRedirect hook
- Client-side API integration

**HTTP:**
- Native Fetch API
- Custom API service layer (lib/api.ts)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791?logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00?logo=sqlalchemy&logoColor=white)

**Framework:**
- FastAPI 0.110
- Uvicorn Server
- Pydantic 2.6 (Data Validation)

**Database:**
- PostgreSQL 12+
- SQLAlchemy 2.0 (ORM)
- Alembic (Migrations)

**Security:**
- JWT Authentication (python-jose)
- Bcrypt Password Hashing (passlib + bcrypt 4.0.1)
- CORS Middleware

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│                  http://localhost:3000                      │
│  ┌───────────────────────────────────────────────────┐   │
│  │  React Components                           │   │
│  │  ├─ Home Page                               │   │
│  │  ├─ Auth (Login/Register)                    │   │
│  │  ├─ Dashboard                               │   │
│  │  ├─ Marketplace                             │   │
│  │  ├─ Chat System                            │   │
│  │  └─ Profile/Wallet                         │   │
│  └───────────────────────────────────────────────────┘   │
│                     ↓ HTTP/CORS (JWT Auth)              │
└─────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                     │
│                  http://localhost:8000                      │
│  ┌───────────────────────────────────────────────────┐   │
│  │  API Endpoints                            │   │
│  │  ├─ /api/v1/auth (Login, Register)      │   │
│  │  ├─ /api/v1/users (Profile, Updates)      │   │
│  │  ├─ /api/v1/skills (CRUD)                │   │
│  │  ├─ /api/v1/sessions (Bookings)           │   │
│  │  ├─ /api/v1/chats (Messaging)            │   │
│  │  └─ /api/v1/transactions (Tokens)         │   │
│  └───────────────────────────────────────────────────┘   │
│                     ↓ SQLAlchemy ORM                     │
└─────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                POSTGRESQL DATABASE                         │
│                    Database: circleed                      │
│  ┌───────────────────────────────────────────────────┐   │
│  │  Tables                                   │   │
│  │  ├─ users (id, email, password, ...)        │   │
│  │  ├─ skills (id, title, teacher_id, ...)     │   │
│  │  ├─ sessions (id, skill_id, status, ...)     │   │
│  │  ├─ chats (id, user_1_id, user_2_id, ...)   │   │
│  │  └─ transactions (id, user_id, amount, ...)  │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
CircleEd-Full-Stack/
│
├── 📁 frontend/                 # Next.js Application
│   ├── app/
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/       # Login page (with auth redirect)
│   │   │   └── register/    # Registration page (with auth redirect)
│   │   ├── (dashboard)/       # Protected pages
│   │   │   ├── marketplace/  # Skill browsing with filtering
│   │   │   ├── marketplace/[id]/ # Skill detail page with reviews
│   │   │   ├── chat/        # Messaging system
│   │   │   ├── bookings/    # Session management
│   │   │   ├── teach/       # Teaching skills
│   │   │   ├── profile/     # User profile & settings
│   │   │   ├── profile/create/ # Profile completion
│   │   │   ├── wallet/      # Token balance & transactions
│   │   │   └── dashboard/   # User dashboard
│   │   ├── page.tsx          # Landing page (with auth redirect)
│   │   ├── layout.tsx        # Root layout with Navbar
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/              # ShadCN UI components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── Sidebar.tsx       # Dashboard sidebar
│   │   ├── SkillCard.tsx     # Skill display card
│   │   ├── Toast.tsx         # Toast notifications
│   │   ├── CreateSkillModal.tsx # Create skill modal
│   │   ├── NotificationCenter.tsx # Notification center
│   │   ├── ProfileCompletionGuard.tsx # Profile check
│   │   ├── PrimaryButton.tsx  # Custom button
│   │   └── SecondaryButton.tsx # Custom button
│   ├── lib/
│   │   ├── api.ts           # API service layer (fully integrated)
│   │   ├── api.ts          # Utility functions
│   │   └── useAuthRedirect.ts # Auth redirect hook
│   └── package.json
│
└── 📁 backend/                  # FastAPI Application
    ├── app/
    │   ├── api/v1/
    │   │   ├── endpoints/
    │   │   │   ├── auth.py       # Authentication (JWT working)
    │   │   │   ├── users.py      # User management
    │   │   │   ├── skills.py     # Skills CRUD with reviews
    │   │   │   ├── sessions.py   # Bookings & tokens
    │   │   │   ├── chats.py      # Messaging system
    │   │   │   └── transactions.py # Token transactions
    │   │   └── api.py        # Route registration
    │   ├── core/
    │   │   ├── config.py      # Settings (with bcrypt 4.0.1)
    │   │   ├── database.py    # DB connection
    │   │   ├── security.py    # JWT & password hashing
    │   │   └── auth.py        # Auth middleware
    │   ├── models/            # SQLAlchemy models
    │   ├── schemas/           # Pydantic schemas
    │   └── db/               # DB initialization & seeding
    ├── server.py              # Production server
    ├── requirements.txt        # Python dependencies (bcrypt 4.0.1)
    ├── vercel.json           # Vercel deployment config
    └── main.py
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+ and pip
- **PostgreSQL** 12+ (or use SQLite mock)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/salmanshahid/CircleEd-Full-Stack.git
   cd CircleEd-Full-Stack
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure Backend**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/circleed
   SECRET_KEY=your-secret-key
   CORS_ORIGINS=http://localhost:3000
   ```

4. **Initialize Database**
   ```bash
   python -m app.db.init_db
   python -m app.db.seed
   ```

5. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Configure Frontend**
   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
   ```

### Running the Application

**Option 1: Quick Start (Recommended)**
```bash
# Windows
start-dev.bat

# Mac/Linux
./start-dev.sh
```

**Option 2: Manual Start**

Terminal 1 - Backend:
```bash
cd backend
python server.py  # Production server (host="0.0.0.0")
# Backend runs on http://localhost:8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Access the Application

- 🌐 **Frontend**: http://localhost:3000
- 🔗 **API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

---

## 📖 API Documentation

### Authentication
```bash
# Register
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}

# Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Returns
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": { ... }
}
```

### Skills
```bash
# Get all skills with filters
GET /api/v1/skills?category=Programming&level=Beginner&search=Python

# Get skill by ID
GET /api/v1/skills/{id}

# Create skill (requires JWT)
POST /api/v1/skills
Headers: Authorization: Bearer {token}
{
  "title": "Learn Python",
  "description": "Complete Python course",
  "category": "Programming",
  "tokens_per_session": 10
}

# Get skill reviews
GET /api/v1/skills/{id}/reviews

# Add review (requires JWT)
POST /api/v1/skills/{id}/reviews
{
  "rating": 5,
  "comment": "Great teacher!"
}
```

### Sessions
```bash
# Book a session (requires JWT)
POST /api/v1/sessions
{
  "skill_id": 1,
  "scheduled_at": "2024-01-15T14:00:00",
  "duration_minutes": 60
}

# Get upcoming sessions (requires JWT)
GET /api/v1/sessions/upcoming

# Confirm session (teacher only, requires JWT)
POST /api/v1/sessions/{id}/confirm

# Cancel session (student only, requires JWT)
POST /api/v1/sessions/{id}/cancel

# Complete session (teacher only, requires JWT)
POST /api/v1/sessions/{id}/complete
```

### Chats
```bash
# Get all chats (requires JWT)
GET /api/v1/chats

# Get messages for a chat (requires JWT)
GET /api/v1/chats/{chat_id}/messages

# Send message (requires JWT)
POST /api/v1/chats/{chat_id}/messages
{
  "content": "Hello, I'd like to book a session!"
}

# Create or get chat (requires JWT)
POST /api/v1/chats
{
  "user_id": 5
}
```

### Transactions
```bash
# Get transaction history (requires JWT)
GET /api/v1/transactions

# Get token balance (requires JWT)
GET /api/v1/transactions/balance
# Returns: { "balance": 150 }
```

**Full interactive API documentation available at**: http://localhost:8000/docs

---

## 🎯 Key Features in Detail

### 🔐 Authentication Flow

1. **Registration**
   - User provides email, password, name
   - Password hashed with bcrypt
   - User created with 100 starting tokens

2. **Login**
   - User provides credentials
   - Backend validates and generates JWT token
   - Token stored in localStorage
   - User redirected to dashboard

3. **Protected Routes**
   - All dashboard pages require authentication
   - Auto-redirect to login if not logged in
   - Auto-redirect to dashboard if already logged in
   - Implemented via custom `useAuthRedirect()` hook

4. **Logout**
   - Clear token from localStorage
   - Redirect to login page
   - Dispatch auth state change event

### 💰 Token Economy

**Earning Tokens:**
- Teach a session → Earn tokens (set by skill price)
- Complete a session → Tokens transferred to teacher
- Review system builds reputation

**Spending Tokens:**
- Book a session → Tokens deducted immediately
- Tokens reserved during booking
- Refunded if session cancelled

**Balance Tracking:**
- Real-time token balance
- Complete transaction history
- Earnings vs spending analytics

### 📅 Session Management

**Booking Flow:**
1. Student browses marketplace
2. Student selects skill and books session
3. Tokens reserved and deducted from student's balance
4. Teacher receives booking request
5. Teacher accepts or declines
6. If declined → Tokens refunded to student
7. If accepted → Session confirmed

**Status States:**
- `pending` - Awaiting teacher confirmation
- `confirmed` - Session scheduled and confirmed
- `completed` - Session finished, tokens earned by teacher
- `cancelled` - Session cancelled, tokens refunded to student

### 💬 Chat System

**Features:**
- One-on-one messaging between users
- Unread message counters
- Chat history preserved
- Real-time notifications (via custom events)

**Flow:**
1. Click "Chat" on skill or booking
2. System creates or retrieves existing chat
3. Send messages between teacher and student
4. Both parties can communicate freely

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: #6366F1;      /* Indigo */
--primary-hover: #4F46E5;

/* Accent Colors */
--accent-purple: #A855F7;
--accent-pink: #EC4899;

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-900: #111827;
```

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 4xl to 2xl
- **Body**: Regular, text-base to text-sm
- **Accent**: Indigo-600 for CTAs

### Components
- **Cards**: White with subtle shadows and hover effects
- **Buttons**: Gradient indigo-to-purple for primary
- **Inputs**: Rounded with focus rings
- **Spacing**: Generous, breathing room

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run build
```

### Backend Tests
```bash
cd backend
pytest
```

### Manual Testing Checklist

**Authentication:**
- [x] Register new user
- [x] Login with valid credentials
- [x] Login with invalid credentials (error handling)
- [x] Logout functionality
- [x] Auto-redirect when logged in
- [x] Auto-redirect when not logged in

**Marketplace:**
- [x] Browse all skills
- [x] Filter by category
- [x] Filter by level
- [x] Filter by language
- [x] Search by keyword
- [x] View skill details
- [x] Check teacher profile
- [x] Read reviews

**Sessions:**
- [x] Book a session
- [x] Token deduction
- [x] View upcoming sessions
- [x] Confirm session (as teacher)
- [x] Cancel session (as student)
- [x] Complete session (as teacher)

**Chat:**
- [x] Send message
- [x] View chat history
- [x] Check unread count
- [x] Navigate between chats

**Tokens:**
- [x] View balance
- [x] Check transaction history
- [x] Verify tokens earned (teaching)
- [x] Verify tokens spent (learning)

---

## 📊 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    hashed_password VARCHAR NOT NULL,
    bio TEXT,
    avatar_url VARCHAR,
    skills_to_teach JSON,
    skills_to_learn JSON,
    token_balance INTEGER DEFAULT 100,
    streak INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Skills Table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    teacher_id INTEGER REFERENCES users(id),
    category VARCHAR NOT NULL,
    level VARCHAR NOT NULL,
    language VARCHAR DEFAULT 'English',
    tokens_per_session INTEGER NOT NULL,
    rating FLOAT DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    badges JSON,
    availability JSON
);

-- Skill Reviews Table
CREATE TABLE skill_reviews (
    id SERIAL PRIMARY KEY,
    skill_id INTEGER REFERENCES skills(id),
    reviewer_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    skill_id INTEGER REFERENCES skills(id),
    teacher_id INTEGER REFERENCES users(id),
    student_id INTEGER REFERENCES users(id),
    scheduled_at TIMESTAMP NOT NULL,
    status VARCHAR DEFAULT 'pending',
    duration_minutes INTEGER DEFAULT 60,
    review_submitted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chats Table
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id),
    user2_id INTEGER REFERENCES users(id),
    last_message TEXT,
    last_message_time TIMESTAMP,
    unread_count_user1 INTEGER DEFAULT 0,
    unread_count_user2 INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id),
    sender_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount INTEGER NOT NULL,
    type VARCHAR NOT NULL, -- 'earn' or 'spend'
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/circleed

# Authentication
SECRET_KEY=your-secret-key-here (generate with: python -c "import secrets; print(secrets.token_urlsafe(64))")
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (comma-separated, NO spaces)
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Environment
ENVIRONMENT=production
USE_MOCK_DB=false
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render)

```bash
# Push to GitHub
git push origin main

# Render will auto-deploy
# Or use Render CLI
render-cli deploy
```

**Environment Variables in Render:**
- `DATABASE_URL` (from PostgreSQL instance)
- `SECRET_KEY` (generate random key)
- `CORS_ORIGINS` (your frontend URL, e.g., `https://your-app.vercel.app`)

**See**: [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📝 Documentation

- [x] [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup guide
- [x] [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [x] [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [x] [CORS_FIX.md](./CORS_FIX.md) - CORS troubleshooting
- [x] [BCRYPT_FIX.md](./BCRYPT_FIX.md) - Security fixes
- [x] [AUTH_REDIRECT.md](./AUTH_REDIRECT.md) - Auth redirects

---

## 🗺️ Roadmap

### ✅ Completed Features
- [x] User authentication (JWT fully implemented)
- [x] Skill marketplace with filtering
- [x] Session booking system
- [x] Chat/messaging system
- [x] Token economy (earn/spend)
- [x] User profiles
- [x] Reviews and ratings
- [x] Transaction history
- [x] Auto-redirect for logged-in users
- [x] Frontend-backend API integration
- [x] PostgreSQL database with real data
- [x] CORS configuration
- [x] Production-ready server configuration

### 🚧 In Progress
- [ ] Real-time WebSocket chat
- [ ] Video conferencing integration (Zoom/Google Meet)
- [ ] Payment gateway integration (Stripe)
- [ ] Enhanced mobile responsiveness

### 🔮 Planned Features
- [ ] Group sessions
- [ ] Skill bundles/courses
- [ ] Learning paths/curriculum
- [ ] Certificates upon completion
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] File uploads (teaching resources, videos)
- [ ] Advanced search (filters, sorting)
- [ ] Teacher verification system

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Database connection error**
```bash
# Solution: Check DATABASE_URL in .env
# Ensure PostgreSQL is running
psql -U postgres
# Or use SQLite mock
USE_MOCK_DB=true
```

**Issue: CORS errors**
```bash
# Solution: Update CORS_ORIGINS in backend .env
CORS_ORIGINS=http://localhost:3000
# For development, you can also use:
CORS_ORIGINS=*
```

**Issue: Password hashing error**
```bash
# Solution: Ensure correct bcrypt version
pip install bcrypt==4.0.1
```

**Issue: Build errors**
```bash
# Solution: Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue: Authentication not working**
```bash
# Solution: Check token storage
# Open browser console and check:
localStorage.getItem("access_token")
# Ensure token is being sent in headers
Authorization: Bearer {token}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **FastAPI** - Python web framework
- **Tailwind CSS** - Styling
- **ShadCN UI** - UI components
- **Lucide** - Icon library
- **PostgreSQL** - Database
- **Bcrypt** - Password hashing

---

## 📞 Support

For support, questions, or suggestions:

- 🐛 **Issues**: [GitHub Issues](https://github.com/salmanshahid/CircleEd-Full-Stack/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/salmanshahid/CircleEd-Full-Stack/discussions)

---

## 📊 Project Stats

<div align="center">

![Lines of Code](https://img.shields.io/badge/Lines%20of%20Code-15%2C000+-blue?style=flat-square)
![Languages](https://img.shields.io/badge/Languages-TypeScript%20%2F%20Python-orange?style=flat-square)
![Contributors](https://img.shields.io/badge/Contributors-1+-green?style=flat-square)

</div>

---

<div align="center">

**If you like this project, please give it a ⭐**

Made with ❤️ by [Salman Shahid](https://github.com/salmanshahid)

[⬆ Back to Top](#-circle-ed---peer-to-peer-learning-platform)

</div>
