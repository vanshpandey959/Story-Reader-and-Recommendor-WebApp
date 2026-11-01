# Story Reader - backend

Express + MongoDB (Mongoose) API for the Story Reader frontend. Auth is a JWT stored in an **httpOnly cookie**
(the token is also returned in the JSON body, and `Authorization: Bearer <token>` is accepted too).

## Setup

```bash
npm install
cp .env.example .env        # then edit JWT_SECRET (and MONGO_URI if needed)
npm run seed                # loads data/data.json into MongoDB + creates the demo user
npm run dev                 # http://localhost:5000/api   (npm start for production)
```

Needs Node 18+ and a running MongoDB (local, or an Atlas connection string in `MONGO_URI`).

### Seed script

| Command | What it does |
|---|---|
| `npm run seed` | Upserts every record of `data.json` by `book_id` (safe to run again, no duplicates) and creates the demo user `demo@example.com` / `demo1234` |
| `npm run seed:fresh` | Deletes all books first, then loads |
| `npm run seed:destroy` | Deletes all books |

Put another file somewhere else with `SEED_FILE=/path/to/data.json npm run seed`.

Field mapping: `book_id -> bookId`, `cover_image_url -> coverImageUrl`, `download_count -> downloadCount`;
`title`, `author`, `summary`, `subjects`, `bookshelves`, `genre` are stored as they are.

## Structure

```
src/
  server.js            starts the server (connect DB, listen, graceful shutdown)
  app.js               express app: helmet, cors, gzip, cookies, routes, error handling
  config/              env.js (reads .env), db.js (mongoose connection)
  models/              User, Book, Library
  controllers/         auth, book, library - the request logic
  routes/              auth.routes, book.routes, library.routes, index (mounted at /api)
  middleware/          auth (protect), validate (zod), error (404 + error handler)
  validators/          zod schemas for signup / login
  utils/               ApiError, asyncHandler, token (JWT + cookie helpers)
  seed/seed.js         data.json -> MongoDB
data/data.json         your books (6005 records)
```

## API

Errors always look like `{ "message": "..." }` (validation errors also carry `details`).

### Auth
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ name, email, password }` | 201 `{ user, token }`, sets cookie. 409 if the email exists |
| POST | `/api/auth/login` | `{ email, password }` | `{ user, token }`, sets cookie. 401 on wrong email/password |
| POST | `/api/auth/logout` | | clears the cookie |
| GET | `/api/auth/me` | | 🔒 current user |

### Books (public)
| Method | Path | Notes |
|---|---|---|
| GET | `/api/books` | `?q=` title/author search, `?genre=`, `?sort=popular\|title\|author`, `?page=&limit=` (max 100). **No page/limit = every match** (what the frontend loads at start). Returns `{ books, total, page, pages, limit }` |
| GET | `/api/books/popular` | `?limit=32` most downloaded |
| GET | `/api/books/genres` | `[{ name, count }]` biggest first |
| GET | `/api/books/:id` | one book (`:id` = Gutenberg id, e.g. 1342) |
| GET | `/api/books/:id/similar` | same genre / author |

A book looks like the `data.json` record plus an `id`:
`{ id, book_id, title, author, summary, subjects, bookshelves, cover_image_url, download_count, genre }`

### Library 🔒 (login required)
Every call returns the whole library: `{ reading: [ids], completed: [ids], saved: [ids] }` (ids are strings, newest first).

| Method | Path | Effect |
|---|---|---|
| GET | `/api/library` | read it |
| POST | `/api/library/:bookId/start` | book becomes "reading" (leaves "completed") |
| POST | `/api/library/:bookId/complete` | moves it from "reading" to "completed" |
| POST | `/api/library/:bookId/save` | toggles the bookmark |

## Connecting the frontend

In the frontend `.env`:
```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```
Response shapes match what the frontend already expects, so nothing else is required. Two optional tweaks make the cookie work end to end:

1. `src/api/client.js` - add `withCredentials: true` to `axios.create({ ... })` so the browser sends / stores the cookie.
2. `src/store/slices/authSlice.js` - in `logout`, also call `client.post("/auth/logout")` so the cookie is cleared on the server.

`CLIENT_URL` in the backend `.env` must be the frontend's origin (default `http://localhost:5173`).
If frontend and backend are on different domains in production, set `COOKIE_SAMESITE=none` (requires HTTPS).

## Security notes
- Passwords are hashed with bcrypt (12 rounds) and never returned by queries.
- JWT in an httpOnly cookie (`secure` in production), `helmet`, CORS limited to `CLIENT_URL`, rate limit on login/signup, request body limited to 10 kb.
- Use a long random `JWT_SECRET` in production.
