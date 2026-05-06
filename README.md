# DailySync

DailySync is a MERN productivity dashboard for managing personal tasks manually, with Clerk authentication and Telegram reminders.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Auth: Clerk
- Notifications: Telegram Bot API
- Scheduling: node-cron
- Deployment: Vercel frontend, Render backend

## Features

- Clerk sign up and sign in
- Manual task CRUD
- Task priorities, due dates, completion state
- Dashboard with today, upcoming, and completed task sections
- Telegram test messages, morning summaries, and deadline reminders
- Dark mode and responsive UI
- Secure cron endpoints using `CRON_SECRET`

## Project Structure

```text
.
├── backend
│   ├── config
│   ├── controllers
│   ├── cron
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── package.json
│   └── server.js
├── docs
│   └── API.md
├── frontend
│   ├── src
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── DEPLOYMENT.md
├── package.json
└── render.yaml
```

## Install

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Environment Variables

Create a root `.env` file and add:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_default_telegram_chat_id

CRON_SECRET=your_cron_secret

CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000
```

## Run Locally

Both at once:

```bash
npm run dev
```

Separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Frontend:
- `http://localhost:5173`

Backend:
- `http://localhost:5000`

## Main API Endpoints

- `GET /api/health`
- `POST /api/auth/sync`
- `GET /api/auth/me`
- `PATCH /api/auth/preferences`
- `GET /api/dashboard`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/telegram/status`
- `POST /api/telegram/send-test`
- `POST /api/cron/morning-summary`
- `POST /api/cron/deadline-alerts`

## Telegram Reminder Behavior

- Morning summaries are sent at the time saved in Settings
- Deadline alerts check every hour
- Both require the backend server to be running

## Deployment

- Frontend: Vercel
- Backend: Render

See [DEPLOYMENT.md](/c:/Users/KIIT0001/Desktop/DailySync/DEPLOYMENT.md) for the deployment steps.

## Notes

- This repo no longer includes Gmail inbox sync
- Tasks are created manually inside the app
- Old Gmail-related code has been removed from the active project flow
