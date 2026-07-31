# Manpower & Recruitment Website

A full-stack manpower and recruitment platform with a React + Vite + TypeScript frontend and a live database (Supabase) for storing jobs, applications, contact messages, and partner/owner info.

## What's included

### Public website
- **Home** — hero banner, company description, stats bar, and **3 partner/owner cards** with photos, name, title, and bio
- **About** — mission, vision, values, and the 3 partner cards
- **Jobs** — searchable listing of **6 dummy jobs** with descriptions
- **Job Details** — full job description + requirements + an **Apply form** (name, email, phone, cover letter, **CV upload**)
- **Contact** — contact form + embedded Google Map
- **Language switcher** — English / हिंदी (preference saved)

### Admin dashboard (`/admin`)
- Password-protected login (demo password: `admin123`)
- **Jobs** — full CRUD (add / edit / delete jobs with description, requirements, vacancies, salary, etc.)
- **Applications** — view all applications with CV download links + **Excel (.xlsx) export**
- **Messages** — view contact messages + **Excel (.xlsx) export**
- **Partners** — edit the 3 owner/partner cards (name, title, bio, **photo upload**)
- **Company** — edit company name, tagline, description, contact details, and Google Map embed URL

### Data & storage
- All data is saved to the live database: jobs, applications (with CV file), contact messages, partners, and company info
- Uploaded CVs and partner photos are stored in storage buckets
- Excel export generates `.xlsx` files in the browser

## Tech stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, react-i18next, lucide-react
- **Database & storage:** Supabase (Postgres + Storage) — connected directly from the frontend with the anon key
- **Excel export:** xlsx (lazy-loaded)

## Run locally
```bash
npm install
npm run dev
```

Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are pre-populated in `.env`.

## Deploy
- Frontend deploys to Netlify (`netlify.toml` included with SPA redirects)
- Set the Supabase env vars in the Netlify dashboard

## Optional: standalone Node/Express/MongoDB backend
A complete Node.js + Express + MongoDB backend lives in `backend/` for those who want a
separate REST API deployment (e.g. on Render) instead of the direct-to-database frontend.
See `backend/README.md` for setup. The frontend currently uses the live database directly.
