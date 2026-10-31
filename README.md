# Resonance — Music Streaming Platform

A full-stack music streaming web app. Listeners stream music, create playlists, mark songs as liked and get personalized recommendations; uploaders submit their own songs with audio, cover image and metadata; admins review uploads and manage users. Full catalog access costs 20 euros a month.

Built with **React** (frontend), **Node.js + Express** (backend API), **PostgreSQL** (database) and **AWS S3** (audio and cover storage), deployed to AWS.

## Repository layout

```
.
├── web/       # React SPA (Vite + TypeScript)
├── server/    # Express API (TypeScript)
├── e2e/       # Playwright end-to-end journeys
├── docker-compose.yml
└── package.json  # npm workspaces root
```

## Prerequisites

- Node.js 18+
- npm 9+

## Install

```sh
npm install
```

## Run locally

```sh
npm run dev
```

This seeds the three test logins into an empty database and starts the API on `http://localhost:3000`. In a second terminal, start the web app:

```sh
npm run dev:web
```

The web app runs on `http://localhost:5173` and proxies `/api` to the server.

## Test

```sh
npm test
```

## Test logins

| Email | Password | Role |
| --- | --- | --- |
| `listener@example.com` | `listener123` | listener |
| `uploader@example.com` | `uploader123` | uploader |
| `admin@example.com` | `admin123` | admin |

## Environment

Copy `.env.example` to `.env` and adjust as needed. The server reads `PORT` from the environment (`process.env.PORT`), defaulting to `3000`.

## Health check

`GET /api/health` returns `{ "status": "ok", ... }`.
