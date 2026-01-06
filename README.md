# Chat Sphere

Modern real-time chat app with light/dark theming, read receipts, online presence, and a refined UI built with React + Tailwind/DaisyUI and a Node/Express/MongoDB backend.

## 🚀 Live Demo
- Frontend: https://chat-sphere-frontend-six.vercel.app
- Backend API (if deployed): https://chat-sphere-znbh.onrender.com

## ✨ Highlights
- Real-time messaging with Socket.IO (online status + read receipts)
- Clean light/dark themes using DaisyUI, persisted per user
- Responsive chat layout with polished auth screens
- JWT auth with httpOnly cookies, bcrypt password hashing
- MongoDB via Mongoose with conversations + messages

## 🧰 Tech Stack
- **Frontend:** React 18, Redux Toolkit, TailwindCSS, DaisyUI, React Router, Axios, React Hot Toast
- **Backend:** Node.js, Express, Socket.IO, Mongoose, JWT, bcrypt, cookie-parser, CORS
- **Build/Deploy:** Vercel (frontend), any Node host for backend (Render/Railway/Fly/etc.)


## 🔧 Local Setup
```bash
# 1) Install deps (from repo root)
npm install
npm install --prefix frontend
npm install --prefix backend

# 2) Env vars
# frontend/.env
REACT_APP_BACKEND_BASE_URL=http://localhost:8080

# backend/.env
MONGO_URI=your_mongo_uri
JWT_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=8080

# 3) Run backend
cd backend
npm run dev

# 4) Run frontend in another shell
cd frontend
npm start
```

## 🧪 Quick Test Plan
- Sign up, then log in
- Open two browsers; verify online badge and read receipts update
- Toggle light/dark; refresh to confirm persistence
- Send messages; verify typing and delivery in real time

## 🛡️ Security Notes
- Auth cookies are httpOnly + same-site strict
- Passwords hashed with bcrypt
- CORS restricted to configured origins

## 🌱 Suggested Enhancements
- CI: add GitHub Actions to run lint/test on pushes
- Demo mode: pre-seeded demo users + one-click demo login
- Accessibility: audit focus states and aria-live for toasts
- Analytics: lightweight event tracking (page view, message send)

## 📜 License
MIT
