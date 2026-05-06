# DailySync API Documentation

Base URL:

`http://localhost:5000/api`

Authentication:

- Clerk handles sign-in on the frontend
- Protected API calls require the Clerk bearer token in `Authorization`

## Health

- `GET /health`

## Auth

- `POST /auth/sync`
- `GET /auth/me`
- `PATCH /auth/preferences`
- `POST /auth/logout`

Example preferences body:

```json
{
  "darkMode": true,
  "morningSummaryTime": "08:00",
  "timezone": "Asia/Calcutta",
  "telegramChatId": "1249395763"
}
```

## Dashboard

- `GET /dashboard`
- Protected
- Returns:
  - task stats
  - today tasks
  - upcoming tasks
  - completed tasks
  - Telegram integration status

## Tasks

- `GET /tasks`
- Protected
- Query params:
  - `completed=true|false`
  - `source=manual`

- `POST /tasks`
- Protected

Example body:

```json
{
  "title": "DBMS Test",
  "description": "Revise joins and normalization",
  "dueDate": "2026-05-07T11:00:00.000Z",
  "priority": "high",
  "source": "manual",
  "status": "pending",
  "metadata": {
    "timeText": "11 AM"
  }
}
```

- `PUT /tasks/:id`
- Protected

- `DELETE /tasks/:id`
- Protected

## Telegram

- `GET /telegram/status`
- Protected

- `POST /telegram/send-test`
- Protected

Example body:

```json
{
  "message": "DailySync test ping"
}
```

## Secure Cron Endpoints

Pass header:

`x-cron-secret: <CRON_SECRET>`

- `POST /cron/morning-summary`
- `POST /cron/deadline-alerts`
