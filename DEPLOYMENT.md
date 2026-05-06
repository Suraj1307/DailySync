# Deployment Guide

## Frontend on Vercel

1. Import the `frontend` folder into Vercel.
2. Framework preset: `Vite`.
3. Build command:
   `npm run build`
4. Output directory:
   `dist`
5. Environment variable:
   `VITE_API_URL=https://your-render-backend.onrender.com`
6. Add:
   `VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key`

## Backend on Render

1. Create a new Web Service from the `backend` folder.
2. Runtime: `Node`.
3. Build command:
   `npm install`
4. Start command:
   `npm start`
5. Add these environment variables:
   - `PORT`
   - `NODE_ENV=production`
   - `MONGO_URI`
   - `CLERK_SECRET_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `CRON_SECRET`
   - `CLIENT_URL`

## MongoDB Atlas

1. Create a free-tier cluster.
2. Add network access.
3. Create a database user.
4. Put the connection string in `MONGO_URI`.

## Telegram

1. Create a bot via BotFather.
2. Copy the bot token to `TELEGRAM_BOT_TOKEN`.
3. Start a chat with the bot.
4. Put your chat id in `TELEGRAM_CHAT_ID` or save it in Settings in the app.

## Secure Cron Endpoints

You can trigger:

- `POST /api/cron/morning-summary`
- `POST /api/cron/deadline-alerts`

with:

`x-cron-secret: <CRON_SECRET>`
