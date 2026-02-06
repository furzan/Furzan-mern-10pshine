# Furzan MERN Notes App

A full‑stack notes application built with a **Node.js/Express + MySQL (Sequelize)** backend and a **React + TypeScript + Vite** frontend.  
Users can sign up, sign in, reset passwords via email, and manage rich‑text notes from a protected dashboard.

## Features

- **User authentication**
  - Email/password sign up & sign in
  - JWT‑based auth with server‑side token validation
  - Protected routes on both backend and frontend
- **Notes management**
  - Create, read, update, and delete notes
  - Rich‑text editor for note content (Jodit)
- **Password recovery**
  - Forgot‑password flow using email
- **Developer experience**
  - Backend tests with Mocha/Chai
  - Frontend tests with Jest + React Testing Library
  - HTTP request logging and centralized error handling

## Tech Stack

- **Backend**: Node.js, Express, Sequelize, MySQL, JWT, Nodemailer, Pino
- **Frontend**: React, TypeScript, Vite, React Router, Axios, Bootstrap, Jodit
- **Testing**: Mocha/Chai (backend), Jest + RTL (frontend)

## Project Structure

```text
backend/   - Express API (auth, notes, DB models, tests)
frontend/  - React SPA (auth pages, dashboard, note editor, tests)
```

---

## Backend (API)

### Environment variables

Create a `.env` file in `backend/` with:

```bash
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=localhost

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_smtp_email_address
EMAIL_PASS=your_smtp_email_password_or_app_password

PORT=5000            # optional, defaults to 5000
NODE_ENV=development # optional
```

### Setup & run

```bash
cd backend
npm install

# Run database migrations/sync is handled by Sequelize on start (non-test env)
npm start
```

The API will run on `http://localhost:5000` by default and exposes routes such as:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET  /api/auth/verifyToken`
- `POST /api/notes/create_note`
- `GET  /api/notes/get_notes`
- `PUT  /api/notes/update_note/:id`
- `DELETE /api/notes/delete_note/:id`

### Backend tests

```bash
cd backend
npm test
```

---

## Frontend (React SPA)

### Environment variables

Create a `.env` file in `frontend/` with:

```bash
VITE_SERVER_URL=http://localhost:5000
```

This is used by Axios to talk to the backend (`/api/...` routes).

### Setup & run

```bash
cd frontend
npm install
npm run dev
```

By default Vite runs on `http://localhost:5173`.  
The backend CORS configuration is already set to allow this origin.

Main routes:

- `/signin` – sign in page (default route)
- `/signup` – sign up page
- `/forgotpass/:email?` – password reset flow
- `/dashboard` – protected dashboard with notes list and editor

### Frontend tests

```bash
cd frontend
npm test           # run once
npm run test:watch # watch mode
npm run test:coverage
```

---

## Running the full app

1. **Start the backend**
   - In one terminal: `cd backend && npm start`
2. **Start the frontend**
   - In another terminal: `cd frontend && npm run dev`
3. Open `http://localhost:5173` in your browser and sign up to start creating notes.

---

## License

This project is open‑source and available under the **MIT License**. See `LICENSE` for details.
