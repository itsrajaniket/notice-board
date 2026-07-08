# Notice Board Application

A production-ready Notice Board built with Next.js (Pages Router), Prisma, TiDB Cloud, and Tailwind CSS.

## Features
- **CRUD Operations**: Create, read, update, and delete notices .
- **Urgent First**: Notices are ordered with `Urgent` priority appearing first.
- **Server-Side Validation**: Robust validation in API routes to prevent bad data.
- **Responsive Design**: Beautiful UI powered by Tailwind CSS, responsive on mobile and desktop viewports.
- **Database Persistence**: Powered by TiDB Cloud via Prisma ORM.

## Tech Stack
- **Framework**: Next.js (Pages Router)
- **Database**: TiDB Cloud (MySQL compatible)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itsrajaniket/notice-board.git
   cd notice-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your TiDB Cloud connection string:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/DATABASE?sslaccept=strict"
   ```

4. **Run Prisma Migration:**
   Apply the database schema to your TiDB cluster:
   ```bash
   npx prisma migrate dev
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the application.

## Vercel Deployment
This application is designed to be easily deployed on Vercel's free Hobby tier.
1. Connect this repository to your Vercel account.
2. Under the project settings, navigate to **Environment Variables**.
3. Add a new variable: `DATABASE_URL` with your TiDB Cloud connection string (ensure `?sslaccept=strict` is appended).
4. Deploy the project. The build command (`npm run build`) automatically generates the Prisma Client.

## AI Usage Statement
**How AI was used to build this project:**
This project was primarily scaffolded and generated using Google's Antigravity AI assistant. 
- **AI-Generated Parts**: The Next.js scaffolding, Tailwind configuration, Prisma schema definition, API routes (`pages/api`), and React frontend components (`index.tsx`, `form.tsx`, `Layout.tsx`) were written by the AI assistant based on strict, detailed instructions provided by the user. The AI also handled the database migration locally via an integrated terminal.
- **Human-Provided Parts**: The human developer reviewed the implementation plan, provided the TiDB database connection credentials, made critical decisions regarding feature scope (such as deferring image upload), and established the GitHub repository and Vercel project linkage.

The interaction was a pair-programming session where the human provided the architecture constraints, and the AI authored the code to meet those exact requirements.
