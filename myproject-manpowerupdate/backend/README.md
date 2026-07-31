# Manpower & Recruitment — Backend

Node.js + Express + MongoDB (Atlas) REST API.

## Setup

```bash
cd backend
cp .env.example .env   # then edit MONGODB_URI, JWT_SECRET, admin creds
npm install
npm run dev
```

Server runs on `http://localhost:5000`.

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign admin tokens |
| `ADMIN_EMAIL` | Seeded admin email |
| `ADMIN_PASSWORD` | Seeded admin password |
| `CLIENT_URL` | Frontend origin for CORS |

On first run an admin account is auto-created from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | – | Admin login, returns JWT |
| GET | `/api/jobs` | – | All jobs (admin sees inactive too) |
| GET | `/api/jobs/public` | – | Active jobs only |
| GET | `/api/jobs/:id` | – | Single job |
| POST | `/api/jobs` | ✔ | Create job |
| PUT | `/api/jobs/:id` | ✔ | Update job |
| DELETE | `/api/jobs/:id` | ✔ | Delete job |
| POST | `/api/applications` | – | Apply (multipart, `resume` file) |
| GET | `/api/applications` | ✔ | List applications |
| DELETE | `/api/applications/:id` | ✔ | Delete application |
| GET | `/api/applications/export/excel` | ✔ | Download `.xlsx` |
| POST | `/api/contacts` | – | Submit contact message |
| GET | `/api/contacts` | ✔ | List messages |
| DELETE | `/api/contacts/:id` | ✔ | Delete message |
| GET | `/api/contacts/export/excel` | ✔ | Download `.xlsx` |
| GET | `/api/company` | – | Company info |
| PUT | `/api/company` | ✔ | Update company info |
| POST | `/api/company/owner-photo` | ✔ | Upload owner photo (`photo` file) |

Uploaded files are served from `/uploads`.

## Deploy on Render

1. Create a new **Web Service**, root directory `backend`.
2. Build command `npm install`, start command `npm start`.
3. Add the environment variables from `.env.example`.
4. The `uploads/` folder is ephemeral on Render's free tier; for production use S3-compatible storage.

## Notes

- Auth uses JWT in `Authorization: Bearer <token>`.
- Passwords are hashed with bcrypt.
- Excel export uses `exceljs`.
