# StoryNest - story reading frontend

React + Vite + Tailwind v4 + Redux Toolkit + React Router + lucide-react.

## Run
```
npm install
# copy your data file to src/data/data.json
cp .env.example .env      # optional
npm run dev
```
Demo login (mock mode): `demo@storynest.com` / `demo1234`, or just sign up.

## Structure
```
src/
  api/          client (axios + mock switch), booksApi, authApi, libraryApi
  store/        slices (auth, books, library, ui) + selectors
  hooks/        useNow (clock), useBookStatus (reading / completed / saved)
  utils/        normalizeBook, recommend, filter, pagination, format, storage
  components/   auth, books, common, home, layout, library
  pages/        Home, Explore, Book, Library, Auth, NotFound
```

## data.json
Only `src/utils/normalizeBook.js` knows your field names. It already understands
`id, title, author, cover_image_url, genres / genre / category, description,
rating, download_count / popularity, language, pages, year, read_url, download_url`
and Gutendex-style `formats`. If something is named differently, add it to the matching list there.
Genres on the Explore page are built from whatever genres exist in the data.

## Going from mock to a real backend
Set `VITE_USE_MOCK=false` and `VITE_API_URL`. Endpoints used:

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | /books | - | `[book]` |
| POST | /auth/login | `{email,password}` | `{user, token}` |
| POST | /auth/signup | `{name,email,password}` | `{user, token}` |
| GET | /library | - | `{reading:[ids], completed:[ids], saved:[ids]}` |
| POST | /library/:id/start | - | full library (book becomes "reading") |
| POST | /library/:id/complete | - | full library (only this moves it out of "reading") |
| POST | /library/:id/save | - | full library (toggle) |

The JWT is sent as `Authorization: Bearer <token>`.
`fetchBooksRequest(params)` already forwards params, so server-side paging can be added later.
