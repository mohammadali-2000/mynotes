# MyNotes

MyNotes is a full-stack Personal Knowledge Management (PKM) web application designed to act as your "second brain". It features a modern, responsive UI with a rich text editor inspired by Notion and Obsidian.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Zustand, Framer Motion, Tiptap.
- **Backend:** Node.js, Express, TypeScript.
- **Database/Auth:** Supabase (PostgreSQL with RLS).
- **Deployment:** Vercel.

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project.
2. Go to the SQL Editor and run the queries found in `supabase/schema.sql` to create your tables and Row Level Security (RLS) policies.
3. Enable Email/Password auth and Google Auth in the Supabase Dashboard.

### 2. Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your Supabase details (`SUPABASE_URL` and `SUPABASE_KEY`).
4. Run `npm run dev` to start the Express server.

### 3. Frontend Setup

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in your Supabase anon details.
4. Run `npm run dev` to start the Vite development server.

## Deployment

The project includes a `vercel.json` file configured for deploying both the Vite frontend and Express backend to Vercel in a single monorepo setup.

1. Import the repository into Vercel.
2. Add your environment variables in the Vercel dashboard.
3. Deploy!
