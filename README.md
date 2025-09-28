# class1048HU
This is website  structure for sharing the content from class 1048 of HU.


## 1 — Project overview & tech stack

Goal: simple multilingual blog where authenticated members can write posts (tags, language), comment, search/filter by language/tag, and public read-only access.

Tech

Backend: Node.js + Express, TypeScript (CommonJS), pg (Postgres), JWT auth, bcrypt

Frontend: Next.js + React + TypeScript, react-i18next for i18n

Database: PostgreSQL

Dev tools: ts-node (backend dev run), ts-node-dev (optional autoreload), npm

## 2 - Repo layout (recommended)
```
my-site/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── migrations/
│   │   └── 001_init.sql
│   └── src/
│       ├── index.ts
│       ├── db.ts
│       ├── middleware/
│       │   └── authMiddleware.ts
│       └── routes/
│           ├── auth.ts
│           ├── posts.ts
│           └── comments.ts
└── frontend/
    ├── package.json
    ├── next.config.js
    ├── tsconfig.json
    └── src/
        ├── pages/
        │   ├── _app.tsx
        │   ├── index.tsx
        │   ├── login.tsx
        │   ├── register.tsx
        │   ├── dashboard.tsx
        │   └── posts/[id].tsx
        ├── components/
        │   ├── Navbar.tsx
        │   ├── PostCard.tsx
        │   ├── CommentList.tsx
        │   └── CommentForm.tsx
        └── i18n/
            ├── en.json
            └── fa.json
```

## 3 - PostgreSQL setup & migrations
### (A) Install & start Postgres

macOS (Homebrew):
```
brew install postgresql
brew services start postgresql
```

### (B) Create DB + role
macOS (Homebrew):
```
brew install postgresql
brew services start postgresql
psql postgres
```
inside psql:
```
CREATE USER amiro WITH PASSWORD '1373';
CREATE DATABASE sitedb OWNER amiro;
GRANT ALL PRIVILEGES ON DATABASE sitedb TO amiro;
\q
```
Apply migrations (if first time running the db):
```
psql amiro -d sitedb -f backend/migrations/001_init.sql
```
## 4 — Backend
```
cd backend
npm install
npm install --save-dev @types/node @types/express

Create a `.env` in `backend/` from `.env.example` and customize if needed:

cp backend/.env.example backend/.env
```
## 5 — Test backend quickly (curl)
start:
```
npx ts-node src/index.ts
# or for dev
npm run dev
```
Register:
```
curl -X POST http://localhost:5001/auth/register \
 -H "Content-Type: application/json" \
 -d '{"username":"test","password":"test123"}'

```
Login -> Get
```
curl -X POST http://localhost:5000/auth/login \
 -H "Content-Type: application/json" \
 -d '{"username":"test","password":"test123"}'
# response: {"token":"..."}
```
Create a post:
```
curl -X POST http://localhost:5000/posts \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOURTOKEN" \
 -d '{"title":"سلام دنیا","content":"این پست فارسی است","tags":["intro","farsi"],"language":"fa"}'

```
Get posts
```
curl "http://localhost:5000/posts?language=fa&tag=intro&search=سلام"

```
Add a comment:
```
curl -X POST http://localhost:5000/comments \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOURTOKEN" \
 -d '{"postId":1,"text":"عالی بود!","language":"fa"}'
```
Get comments:
```
curl "http://localhost:5000/comments/1?language=fa"
```