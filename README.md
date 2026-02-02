# CAMPUSLY – Campus Connection & Updates Platform

A full-stack campus connection platform for college students: events, news, opportunities, and anonymous happenings feed.

## Tech Stack

- **Frontend:** React, React Router, Context API, Axios, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt

## Features

- **Auth:** Login, Register, Logout, protected routes, roles (user / admin)
- **Home & Events:** Upcoming events with like count, date/time, posted by
- **News:** Opportunities (Internship, Project, Startup, Registration) with admin approval
- **Happenings:** Anonymous Twitter-like feed; posts go live immediately
- **Post modal:** Choose type (Happening / Event / News); Event & News require admin approval
- **Admin panel:** View stats (users, posts, pending), approve or reject event/news submissions
- **Dark mode:** Toggle in Settings; bright shiny colours in light and dark themes
- **Logo:** Place your logo at `frontend/public/logo.png` to show it in the navbar and on login/register. If missing, the text “campusly” is shown.

## Project structure

```
project/
├── backend/          # Express API
│   ├── models/       # User, Post
│   ├── routes/       # auth, posts, admin
│   ├── middleware/   # protect, adminOnly
│   └── server.js
├── frontend/         # React (Vite)
│   └── src/
│       ├── api/      # axios instance
│       ├── components/
│       ├── context/   # AuthContext
│       └── pages/
└── README.md
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI (e.g. MongoDB Atlas) and JWT_SECRET
npm install
npm run dev
```

Runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`. API calls are proxied to the backend via Vite.

### 3. Create an admin user

After registering a user, set their role in MongoDB:

```js
db.users.updateOne(
  { email: "admin@college.edu" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass / Atlas UI to change one user's `role` to `admin`.

## Environment variables

**Backend (`.env`):**

| Variable     | Description                    |
|-------------|--------------------------------|
| PORT        | Server port (default 5000)     |
| MONGODB_URI | MongoDB connection string     |
| JWT_SECRET  | Secret for signing JWTs       |
| NODE_ENV    | development / production      |
| CLIENT_URL  | Frontend URL (for CORS)       |

**Frontend (`.env`):**

| Variable      | Description                          |
|---------------|--------------------------------------|
| VITE_API_URL  | Backend API base URL (e.g. `/api` in dev, full URL in prod) |

## Deployment

- **Backend:** Deploy to Render, Railway, or similar. Set `MONGODB_URI` (e.g. MongoDB Atlas) and `JWT_SECRET`. Set `CLIENT_URL` to your frontend URL.
- **Frontend:** Deploy to Vercel/Netlify. Set `VITE_API_URL` to your backend URL (e.g. `https://campusly-api.onrender.com`).
- **Database:** Use MongoDB Atlas and set `MONGODB_URI` in the backend.

## License

MIT
