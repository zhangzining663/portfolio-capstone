# Full-Stack Portfolio & Blog Application

**Student:** Zining Zhang (张孜宁)
**Student ID:** 24998046
**Course:** Web Data Management and Application
**Project type:** Cumulative full-stack capstone (REST API + React SPA)

## 1. Project overview

This is a personal portfolio website with a built-in blog. It has two parts:

- **`server/`** — a Node.js + Express REST API. It talks to a cloud MongoDB Atlas database through Mongoose, handles user registration/login with JWT, and exposes CRUD endpoints for projects, blog posts, comments and contact messages.
- **`client/`** — a React single-page application built with React Router. It shows the public portfolio and blog to visitors, and provides a protected admin dashboard where the logged-in author can create, edit and delete projects and posts.

The admin user does not exist by default: open the Register page and create one account yourself; that account becomes the author who can manage content and post comments.

## 2. Live deployed links

- Front-end (public website, GitHub Pages): https://zhangzining663.github.io/portfolio-capstone/
- Back-end (REST API, Render free instance): https://portfolio-capstone.onrender.com

Sample public endpoints you can open directly:

- Projects list: https://portfolio-capstone.onrender.com/api/projects
- Blog list: https://portfolio-capstone.onrender.com/api/blog

## 3. Tech stack

| Layer     | Tools |
|-----------|-------|
| Back-end  | Node.js, Express, Mongoose, MongoDB Atlas, bcryptjs, jsonwebtoken, helmet, cors, dotenv |
| Front-end | React 18, React Router v6, Context API, Vite |
| Database  | MongoDB Atlas (cloud) |

## 4. Folder structure

```
CapstoneProject/
├── server/                 # back-end API
│   ├── server.js           # entry point, middleware + route wiring
│   ├── config/db.js        # MongoDB connection
│   ├── middleware/         # auth (JWT protect) + central error handler
│   ├── models/             # User, Project, BlogPost, Comment, Message
│   ├── controllers/         # business logic per resource
│   └── routes/             # URL → controller mapping
├── client/                 # React SPA
│   └── src/
│       ├── api/             # fetch wrapper pointing at the API base URL
│       ├── context/         # AuthContext (global login state)
│       ├── components/      # Header, Footer, cards, ProtectedRoute, admin panels
│       ├── pages/          # Home, Projects, Blog, BlogDetail, Contact, Login, Register, Admin
│       └── styles/          # global CSS
└── README.md
```

## 5. Local setup

### Prerequisites

- Node.js 18 or above
- A free MongoDB Atlas cluster (https://www.mongodb.com/atlas)

### Step 1 — Start the back-end API

1. `cd server`
2. Copy `.env.example` to `.env` and edit it:

   ```
   PORT=5000
   MONGODB_URI=your-atlas-connection-string
   JWT_SECRET=any-long-random-secret-string
   CLIENT_URL=http://localhost:5173
   ```

3. Install dependencies and run:

   ```
   npm install
   npm run dev
   ```

   The API should print `MongoDB Atlas connected` and `Server listening on port 5000`.

### Step 2 — Start the front-end React app

1. Open a second terminal, `cd client`
2. Copy `.env.example` to `.env` and set the API address:

   ```
   VITE_API_URL=http://localhost:5000
   ```

3. Install dependencies and run:

   ```
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`. Register an account, log in, and you will be redirected to the `/admin` dashboard.

### How the front-end connects to the back-end

All requests go through `client/src/api/client.js`, which reads `VITE_API_URL` from the environment. Protected admin and comment requests add the header `Authorization: Bearer <token>` automatically, where `token` comes from the stored login response in `AuthContext`.

## 6. API reference

Base URL locally: `http://localhost:5000`. Protected routes require the `Authorization: Bearer <token>` header.

### Auth — `/api/users`

| Method | Path            | Access    | Purpose                              | Request body |
|--------|-----------------|-----------|--------------------------------------|--------------|
| POST   | `/api/users/register` | Public | Create a user (password hashed with bcrypt) | `{ username, email, password }` |
| POST   | `/api/users/login`   | Public | Verify credentials, return JWT and user data | `{ email, password }` |

### Projects — `/api/projects`

| Method | Path              | Access     | Purpose | Request body / params |
|--------|-------------------|------------|---------|------------------------|
| GET    | `/api/projects`       | Public | List all projects (newest first) | — |
| GET    | `/api/projects/:id`    | Public | Get one project by id | `:id` |
| POST   | `/api/projects`       | Protected | Create a project linked to the logged-in user | `{ title, description, imageUrl?, repoUrl?, liveUrl? }` |
| PUT    | `/api/projects/:id`   | Protected | Update a project (owner only) | same fields as above |
| DELETE | `/api/projects/:id`   | Protected | Delete a project (owner only) | `:id` |

### Contact — `/api/contact`

| Method | Path            | Access | Purpose | Request body |
|--------|-----------------|--------|---------|--------------|
| POST   | `/api/contact`  | Public | Save a visitor message into the Message collection | `{ name, email, message }` |

### Blog posts — `/api/blog`

| Method | Path          | Access              | Purpose | Request body / params |
|--------|---------------|---------------------|---------|------------------------|
| GET    | `/api/blog`        | Public | List all posts with author username | — |
| GET    | `/api/blog/:id`    | Public | One post, populated author and its comments | `:id` |
| POST   | `/api/blog`        | Protected | Create a post under the logged-in author | `{ title, content }` |
| PUT    | `/api/blog/:id`    | Protected, author only | Update a post | `{ title, content }` |
| DELETE | `/api/blog/:id`    | Protected, author only | Delete a post (its comments are removed too) | `:id` |

### Comments — `/api/blog/:postId/comments`

| Method | Path                          | Access    | Purpose | Request body |
|--------|-------------------------------|-----------|---------|--------------|
| GET    | `/api/blog/:postId/comments`   | Public | List comments of a post | `:postId` |
| POST   | `/api/blog/:postId/comments`   | Protected | Add a comment as the logged-in user | `{ body }` |

## 7. Front-end routes

| Path        | Page | Access |
|-------------|------|--------|
| `/`         | Home / About me | Public |
| `/projects` | Projects gallery (fetches `GET /api/projects`) | Public |
| `/blog`     | Blog list (fetches `GET /api/blog`) | Public |
| `/blog/:id` | Post detail, comments (fetches `GET /api/blog/:id`) | Public |
| `/contact`  | Contact form (posts to `POST /api/contact`) | Public |
| `/login`    | Login form | Public |
| `/register` | Register form | Public |
| `/admin`    | Admin dashboard (manage projects + posts) | Protected, redirects to `/login` when logged out |

## 8. Deployment notes

- **API (Render, free web service):** repository root directory is set to `server`; build command `npm install`, start command `npm start`. Environment variables set in the Render dashboard: `MONGODB_URI`, `JWT_SECRET` (`CLIENT_URL` is optional; when unset CORS falls back to `*`). Render injects `PORT`, and `server.js` reads `process.env.PORT || 5000`.
- **Front-end (GitHub Pages):** `npm run build` produces the static `dist` folder; its contents are published from the `gh-pages` branch at the repository root. `client/.env.production` sets `VITE_API_URL` to the Render URL at build time, and `client/vercel.json` style SPA rewrite (`dist/404.html` copied from `index.html`) keeps client-side routing working on page refresh. The deployed site base path is `/portfolio-capstone/`, configured in `vite.config.js` and the React Router `basename`.

## 9. Error handling & security notes

- Mongoose validation runs on every model; missing required fields return a 400 JSON message.
- Passwords are never stored in plain text (bcrypt hashed before save).
- Unknown routes hit a 404 handler; all thrown errors go through one central error-handling middleware.
- `helmet` sets secure HTTP headers and `dotenv` keeps secrets out of the source code.
- Blog edit/delete checks `post.author` against `req.user`; a non-author receives 403.
