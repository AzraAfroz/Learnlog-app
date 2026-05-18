<div align="center">
  <h1>🚀 LearnLog</h1>
  <p>A smart, beautifully designed student learning journal to track study habits, topics, and progress.</p>

  <p>
    <a href="https://learn-log-ten.vercel.app" target="_blank">View Live Demo</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

<hr />

## 👋 Welcome to LearnLog

LearnLog is a modern full-stack web application designed to help students track their daily learning progress. Whether you are prepping for exams or learning a new skill, LearnLog keeps your notes, study durations, and difficulty levels organized in one intuitive dashboard.

This project was built with a focus on **clean architecture**, **security**, and a **beautiful user experience** using the MERN stack.

---

## ✨ Features

- **🔐 Secure Authentication**
  - Robust JWT-based authentication.
  - Secure password hashing using Bcrypt.
  - Email verification workflow (via Nodemailer).
  - Forgot & Reset password flows.

- **📓 Smart Journaling**
  - Log daily study sessions including topics, duration, and difficulty.
  - Search and filter your past entries easily.
  - Edit or remove entries as your understanding evolves.

- **📊 Insights Dashboard**
  - Get a high-level view of your learning habits.
  - View total entries and cumulative study hours.
  - Visualize your weekly learning summary.
  - See your most recently tackled topics at a glance.

- **👤 User Profiles**
  - Update your personal information.
  - Upload profile avatars seamlessly.
  - Change your password securely.

---

## 🛠️ Tech Stack

We carefully chose a modern stack to ensure performance, scalability, and an excellent developer experience.

### Frontend
- **React 19** & **Vite** — For a lightning-fast UI and dev server.
- **Tailwind CSS v4** — For beautiful, responsive, and utility-first styling.
- **React Router** — Smooth client-side routing.
- **Axios** & **React Hot Toast** — For reliable API requests and elegant notifications.

### Backend
- **Node.js** & **Express** — Robust and scalable API foundation.
- **MongoDB** & **Mongoose** — Flexible NoSQL database and elegant object modeling.
- **Security** — `helmet`, `express-rate-limit`, `cors`.
- **Multer** & **Nodemailer** — For file uploads and transactional emails.

---

## 🚀 Getting Started

Want to run LearnLog locally? Follow these simple steps.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed, and a [MongoDB](https://www.mongodb.com/) database ready (either local or Atlas).

### 1. Backend Setup

Open a terminal and set up the API:

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory and add your configurations:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

### 2. Frontend Setup

Open a new terminal window for the React app:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Your app will now be running at `http://localhost:5173`. Happy logging!

---

## 📂 Project Structure

A quick look at how the codebase is organized:

```text
LearnLog/
├── Backend/                 # Express API
│   ├── controllers/         # Business logic (Auth, Dashboard, Journal, Profile)
│   ├── middleware/          # Route protection and file uploads
│   ├── models/              # Mongoose database schemas
│   ├── routes/              # API endpoints
│   ├── utils/               # Helpers (e.g., Email Sender)
│   └── Server.js            # Express application entry point
│
└── frontend/                # React UI
    └── src/
        ├── components/      # Reusable UI elements (Navbar, Sidebar)
        ├── context/         # React Context for global state (AuthContext)
        ├── pages/           # Main views (Dashboard, Login, Profile, etc.)
        ├── services/        # Axios API configurations
        └── App.jsx          # Routing setup
```

---

<div align="center">
  <p>Built with ❤️ for better learning.</p>
</div>
