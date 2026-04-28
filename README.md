# TaskFlow — Mini SaaS Task Manager

A production-ready, multi-user Task Management SaaS built with Node.js, Express, PostgreSQL (Sequelize), React (Vite), and Tailwind CSS.

---

## Project Overview

TaskFlow is a secure, multi-user task management application where each user has a private, isolated task list. It features JWT-based authentication, password hashing with bcrypt, and full CRUD operations on tasks — all backed by a well-structured REST API.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Runtime | Node.js 20 |
| Backend Framework | Express 4 |
| Authentication | bcryptjs + jsonwebtoken |
| Validation | express-validator |
| ORM | Sequelize 6 |
| Database | PostgreSQL 15 |
| Frontend Framework | React 18 (Vite) |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| State Management | React Context API |

---

## Features

- **JWT Authentication** — Secure signup and login with 7-day token expiry
- **Password Hashing** — bcrypt with cost factor 12
- **Protected Routes** — All task endpoints require a valid JWT
- **Multi-User Isolation** — Each user can only access their own tasks
- **Task CRUD** — Create, list, update status, and delete tasks
- **Status Toggling** — One-click toggle between `pending` and `completed`
- **Filter Tabs** — Filter tasks by All / Pending / Completed
- **Loading States** — Spinner on all async operations
- **Error Messages** — Inline error feedback on all forms
- **Cascade Delete** — Deleting a user removes all their tasks

---

## Project Structure

```
task-manager-saas/
├── backend/
│   ├── config/
│   │   └── db.js                # Sequelize instance + connection pooling
│   ├── controllers/
│   │   ├── authController.js    # register / login handlers
│   │   └── taskController.js    # CRUD handlers, scoped by userId
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification, attaches req.user
│   │   └── errorMiddleware.js   # Global error handler
│   ├── models/
│   │   ├── index.js             # Associations + exports
│   │   ├── user.js              # User model
│   │   └── task.js              # Task model (FK: userId)
│   ├── routes/
│   │   ├── authRoutes.js        # POST /api/auth/register|login
│   │   └── taskRoutes.js        # GET/POST/PUT/DELETE /api/tasks
│   ├── utils/
│   │   └── generateToken.js     # JWT signing helper
│   ├── app.js                   # Express app config
│   ├── server.js                # DB sync + listen
│   └── .env.example             # Environment variable template
└── frontend/
    └── src/
        ├── api/
        │   ├── axios.js         # Axios instance with interceptors
        │   ├── auth.js          # Auth API calls
        │   └── tasks.js         # Task API calls
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── TaskCard.jsx
        │   └── TaskForm.jsx
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Dashboard.jsx
```

---

## API Endpoints

### Auth

| Method | Endpoint | Body | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | No |
| POST | `/api/auth/login` | `{ email, password }` | No |

**Response shape (both):**
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/tasks` | — | List all tasks for the logged-in user |
| POST | `/api/tasks` | `{ title, description? }` | Create a new task |
| PUT | `/api/tasks/:id` | `{ title?, description?, status? }` | Update task fields |
| DELETE | `/api/tasks/:id` | — | Delete a task |

**Status values:** `pending` | `completed`

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally (or a cloud URL from Neon/Supabase)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-manager-saas
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanager
JWT_SECRET=your_random_secret_here
JWT_EXPIRES_IN=7d
```

Create the PostgreSQL database:

```sql
CREATE DATABASE taskmanager;
```

Start the backend (auto-syncs the schema on first run):

```bash
npm run dev
# or: node server.js
```

The server will be available at `http://localhost:5000`.  
Health check: `GET http://localhost:5000/health`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment

### Backend → Render / Railway

1. Push your code to GitHub.
2. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add environment variables:
   - `DATABASE_URL` — your Neon or Supabase PostgreSQL connection string
   - `JWT_SECRET` — a long random string
   - `JWT_EXPIRES_IN` — `7d`
   - `NODE_ENV` — `production`
   - `FRONTEND_URL` — your Vercel URL (for CORS)

### Database → Neon / Supabase

1. Create a free PostgreSQL database at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. Copy the connection string (it must be the **pooled** URL for Neon).
3. Paste it as `DATABASE_URL` in your backend environment.
4. The schema will auto-sync on first server start.

### Frontend → Vercel

1. Push your code to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `VITE_API_URL` — your Render/Railway backend URL (e.g. `https://your-api.onrender.com`)
5. Deploy.

---

## Environment Variables Reference

### Backend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key for signing JWTs | Any long random string |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `FRONTEND_URL` | Frontend origin for CORS | `https://your-app.vercel.app` |

### Frontend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
