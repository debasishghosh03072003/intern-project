# 🚀 intern-project — Next.js Backend API

A production-ready **REST API backend** built with **Next.js 15 App Router**, **MongoDB (Mongoose)**, and **TypeScript**. No Express — all routes are native Next.js API handlers.

---

## 📁 Project Structure

```
intern-project/
├── app/
│   └── api/
│       └── v1/
│           ├── auth/
│           │   ├── register/route.ts   POST  Register a new user
│           │   └── login/route.ts      POST  Login and receive JWT
│           ├── users/
│           │   └── route.ts            GET   List all users (admin only)
│           ├── tasks/
│           │   ├── route.ts            POST / GET  Create / list tasks
│           │   └── [id]/route.ts       GET / PUT / DELETE  Single task
│           └── health/route.ts         GET   Server + DB health check
├── lib/
│   ├── db.ts                           Mongoose connection (cached)
│   └── validators.ts                   Zod v4 schemas for all inputs
├── middleware/
│   ├── auth.ts                         JWT verify + role check
│   ├── logger.ts                       Request logging wrapper
│   └── rateLimit.ts                    In-memory rate limiter
├── models/
│   ├── User.ts                         User Mongoose model
│   └── Task.ts                         Task Mongoose model
└── utils/
    ├── response.ts                     Standardised JSON helpers
    ├── errorHandler.ts                 Central error handler
    ├── jwt.ts                          signToken / verifyToken
    ├── logger.ts                       Structured console logger
    └── pagination.ts                   getPaginationOptions helper
```

---

## ⚡ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env.local` (already created):
```env
MONGODB_URI=mongodb://localhost:27017/intern-project
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production
JWT_EXPIRES_IN=7d
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

### 3. Run dev server
```bash
npm run dev
```
Server starts at **http://localhost:3000**

---

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api/v1
```

---

### 🔐 Auth

#### `POST /api/v1/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "..."
  }
}
```

---

#### `POST /api/v1/auth/login`
Login and receive a Bearer token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<JWT>",
    "user": { "_id": "...", "name": "John Doe", "email": "...", "role": "user" }
  }
}
```

---

### 👥 Users

All requests require: `Authorization: Bearer <token>`

#### `GET /api/v1/users` *(Admin only)*
List all users with pagination.

**Query params:** `?page=1&limit=10`

---

### ✅ Tasks

All requests require: `Authorization: Bearer <token>`

#### `POST /api/v1/tasks`
Create a task (assigned to the authenticated user).

**Body:**
```json
{
  "title": "Fix bug #42",
  "description": "Reproduce and fix the login crash",
  "status": "pending"
}
```

---

#### `GET /api/v1/tasks`
List tasks. Users see only their own; admins see all.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `status` | string | Filter by `pending` \| `in-progress` \| `completed` |

---

#### `GET /api/v1/tasks/:id`
Get a single task by ID.

#### `PUT /api/v1/tasks/:id`
Update a task. Users can only update their own tasks.

**Body (all fields optional):**
```json
{
  "title": "Updated title",
  "status": "in-progress"
}
```

#### `DELETE /api/v1/tasks/:id`
Delete a task. Users can only delete their own.

---

### ❤️ Health

#### `GET /api/v1/health`
Returns server status, DB connection state, and uptime. No auth required.

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-04-22T14:00:00.000Z",
  "uptime": 120.4,
  "database": { "status": "connected", "name": "intern-project" },
  "latencyMs": 3
}
```

---

## 🛡️ Security

| Feature | Implementation |
|---------|---------------|
| Password hashing | `bcryptjs` with 12 salt rounds |
| JWT auth | `jsonwebtoken` — Bearer token in `Authorization` header |
| Input validation | Zod v4 schemas on every route |
| Password never exposed | `select: false` on User model |
| Role-based access | `authenticate()` + `requireAdmin()` middleware |
| Rate limiting | Per-IP in-memory limiter (swap for Redis in prod) |
| Expired/invalid JWT | Handled with specific 401 error messages |
| Duplicate email | 409 Conflict with clear message |
| Invalid ObjectId | 400 before hitting the DB |

---

## 📊 Standard Response Shape

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... },
  "errors": [ { "field": "email", "message": "Invalid email" } ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

## 🧪 Testing with Postman

1. Import and hit `POST /api/v1/auth/register` to create a user
2. Hit `POST /api/v1/auth/login` — copy the `token` from the response
3. Set header `Authorization: Bearer <token>` on all subsequent requests
4. Use `role: "admin"` at register time to access admin-only routes

---

## 🔧 Production Checklist

- [ ] Set a strong `JWT_SECRET` (≥ 32 random bytes)
- [ ] Use a proper MongoDB Atlas URI in `MONGODB_URI`
- [ ] Replace in-memory rate limiter with Redis (`ioredis` + `rate-limiter-flexible`)
- [ ] Add `HTTPS` / reverse proxy (Nginx / Vercel)
- [ ] Enable `NODE_ENV=production`
- [ ] Add monitoring / APM (e.g. Sentry, Datadog)
