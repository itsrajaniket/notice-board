# 📌 Notice Board Application

![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-1B222D?logo=prisma)
![TiDB](https://img.shields.io/badge/TiDB-Cloud-white?logo=tidb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Web-lightgrey)

A responsive, production-ready notice board to create, manage, and view important announcements efficiently.

## Table of contents
- [Project overview](#project-overview)
- [Live demo & visuals](#live-demo--visuals)
- [Tech stack & choices](#tech-stack--choices)
- [Core features](#core-features)
- [Architecture & project structure](#architecture--project-structure)
- [State management & data flow](#state-management--data-flow)
- [API reference](#api-reference)
- [Local installation & setup](#local-installation--setup)
- [Configuration & customization](#configuration--customization)
- [Known limitations & troubleshooting](#known-limitations--troubleshooting)
- [Security & privacy notes](#security--privacy-notes)
- [Future roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Project overview
This project is a full-stack web application designed for broadcasting announcements across an organization or community. Schools, companies, and community groups often struggle with scattered communication channels, leading to missed updates and confusion. *This application centralizes announcements with a clear priority system, ensuring urgent information is always seen first.*

## Live demo & visuals
**Live demo:** [https://notice-board-tau-seven.vercel.app/](https://notice-board-tau-seven.vercel.app/)

![Notice Board Dashboard](./public/reno_img.jpeg)

## Tech stack & choices

| Technology | Version | Category | Why Chosen |
| --- | --- | --- | --- |
| Next.js (Pages Router) | 16.2.10 | Core | Provides built-in API routes and server-side rendering without the complexity of configuring a separate backend server. |
| React | 19.2.4 | Core | Component-based UI creation allows for reusable layout elements and manageable state. |
| Prisma | 5.22.0 | Storage & APIs | Type-safe ORM that generates highly optimized SQL queries and eliminates entire classes of runtime errors. |
| TiDB Cloud | Latest | Storage & APIs | Serverless MySQL-compatible database that scales automatically and offers generous free tiers for hobby projects. |
| Tailwind CSS | 4.x | Styling | Utility-first CSS framework that removes the need for context-switching to CSS files, dramatically speeding up UI iteration. |
| date-fns | 4.4.0 | Utilities | Lightweight date manipulation library that provides necessary formatting functions without the heavy bundle size of Moment.js. |
| lucide-react | 1.23.0 | Assets | Clean, customizable SVG icons that bundle efficiently via tree-shaking. |
| next-themes | 0.4.4 | Utilities | Prevents Next.js hydration mismatch while providing seamless light/dark mode toggling. |

## Core features

### Notice management ⭐
- **What it does:** Allows users to create, read, update, and delete announcements through a unified interface.
- **User experience:** Users interact with a clean form that validates input dynamically and provides immediate visual feedback upon submission or failure.

### Priority sorting ⭐
- **What it does:** Enforces database-level sorting where `Urgent` notices explicitly bypass chronological ordering to appear at the top of the feed.
- **User experience:** When viewing the board, critical alerts immediately catch the eye with distinct red styling and top placement.
  - Distinct visual badges for category types (Exam, Event, General).

### Premium UI & dark mode ⭐
- **What it does:** Provides a stunning glassmorphism interface with a fully integrated, seamless light/dark mode toggle.
- **User experience:** Users enjoy smooth micro-animations, physics-based hover lifts, and rich neon gradients for urgent notices, without any page flickering when switching themes.

### Server-side validation
- **What it does:** Intercepts incoming API payloads and strictly validates data types, required fields, and enum bounds before attempting database transactions.
- **User experience:** Prevents malformed data from breaking the UI and returns helpful error messages if something goes wrong.

## Architecture & project structure
This is a monolithic serverless application. The client-side React code and the server-side Node.js API handlers are co-located in a single repository and deployed together on Vercel. Database interactions occur strictly within the serverless API routes via the Prisma Client.

```text
notice-board/
├── prisma/
│   ├── schema.prisma            # Database schema and Prisma configuration 🌟
│   └── migrations/              # SQL migration history
├── src/
│   ├── components/
│   │   └── Layout.tsx           # Global UI wrapper with navigation and footer
│   ├── lib/
│   │   └── prisma.ts            # Singleton Prisma Client instantiation to prevent connection exhaustion
│   ├── pages/
│   │   ├── api/
│   │   │   └── notices/
│   │   │       ├── index.ts     # Handles GET (list all) and POST (create)
│   │   │       └── [id].ts      # Handles GET (single), PUT (update), and DELETE
│   │   ├── notice/
│   │   │   └── form.tsx         # Unified Add/Edit React form component
│   │   ├── _app.tsx             # Next.js application entry point
│   │   ├── _document.tsx        # Base HTML document structure
│   │   └── index.tsx            # Main dashboard displaying all notices
│   └── styles/
│       └── globals.css          # Global Tailwind and custom CSS rules
├── .env                         # Local environment variables (git-ignored)
└── package.json                 # Project dependencies and scripts
```

## State management & data flow
State is managed locally within React components using the standard `useState` and `useEffect` hooks. Because the application is relatively flat, there is no need for complex global state managers like Redux.

**Data flow walkthrough — Creating a new notice:**
1. The user navigates to `src/pages/notice/form.tsx` and fills out the input fields.
2. The user's input updates the local `formData` state object in real-time via the `handleChange` function.
3. The user clicks "Publish Notice", triggering the `handleSubmit` function.
4. `handleSubmit` pauses the UI with a loading state (`setIsSaving(true)`) and sends a `POST` request containing `formData` to `src/pages/api/notices/index.ts`.
5. The API route receives the payload in `req.body`, performs strict server-side validation, and utilizes `prisma.notice.create()` to write to the TiDB database.
6. Upon a successful HTTP 201 response, the client-side router (`router.push('/')`) redirects the user back to the dashboard.
7. The dashboard (`src/pages/index.tsx`) mounts, runs its `useEffect` hook, fetches the updated notice list from `GET /api/notices`, and renders the new UI.

## API reference
The application exposes a private REST API consumed by the frontend.

| Method | Endpoint | Description | Request Body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/notices` | Fetches all notices, ordered by priority | N/A | `Array<Notice>` |
| `POST` | `/api/notices` | Creates a new notice | `{ title, body, category, priority, publishDate, image }` | `Notice` (201) or Error (400/500) |
| `GET` | `/api/notices/:id` | Fetches a specific notice by ID | N/A | `Notice` (200) or Error (404) |
| `PUT` | `/api/notices/:id` | Updates an existing notice | `{ title, body, category, priority, publishDate, image }` | `Notice` (200) or Error (400/404) |
| `DELETE` | `/api/notices/:id` | Deletes a notice | N/A | Success msg (200) or Error (404) |

## Local installation & setup

**Prerequisites:**
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- A free TiDB Cloud account

**Step-by-step installation:**

1. Clone the repository and navigate into the project directory:
```bash
git clone https://github.com/itsrajaniket/notice-board.git
cd notice-board
```

2. Install dependencies:
```bash
npm install
```

3. Create the environment file:
```bash
touch .env
```

**Environment variables:**
Open the `.env` file and insert your TiDB Serverless connection string. It must include the SSL parameter.
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/DATABASE?sslaccept=strict"
```

4. Apply the database schema:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

**Verifying it works:** Open `http://localhost:3000` in your browser — you should see the empty dashboard waiting for your first notice.

## Configuration & customization
The most common areas a developer will modify:

- **Adding new categories:**
  Navigate to `prisma/schema.prisma` and update the `Category` enum. Then run `npx prisma migrate dev` to push changes to the database.
  ```prisma
  enum Category {
    Exam
    Event
    Meeting
    Maintenance
    Holiday
    Alert
    News
    General
  }
  ```

- **Adjusting UI colors:**
  Tailwind v4 variables are defined in `src/styles/globals.css`. Adjust the root hex codes to change the global theme.
  ```css
  :root {
    --background: #ffffff;
    --foreground: #171717;
  }
  ```

## Known limitations & troubleshooting

**Known limitations:**
- Image storage currently relies on users providing external URLs; direct file uploads are not supported yet due to Vercel's ephemeral filesystem.
- Pagination is not yet implemented for the main dashboard, which could impact performance if thousands of notices exist.

**Common errors & fixes:**
| Error / Symptom | Likely Cause | Fix |
| --- | --- | --- |
| `Connections using insecure transport are prohibited` | Missing SSL flag on database URL | Append `?sslaccept=strict` to your `DATABASE_URL`. |
| `Prisma Client is unable to run in this environment` | Prisma Client was not generated | Ensure `npm install` runs fully; run `npx prisma generate` manually. |
| `500 Internal Server Error (Unexpected token <)` on Vercel | Vercel failed to generate Prisma Client | Ensure `"postinstall": "prisma generate"` exists in `package.json` scripts and redeploy. |

## Security & privacy notes
- **Credentials:** The application requires a single database connection string (`DATABASE_URL`). This is injected securely via environment variables during deployment and is **never** committed to version control or exposed to the client-side JavaScript.
- **Data sanitization:** Prisma ORM automatically uses parameterized queries to protect against SQL injection attacks.
- **XSS Protection:** React safely escapes all notice content by default during rendering, preventing cross-site scripting.
- **Privacy:** As an open dashboard, there is currently no authentication layer; anyone with the URL can view, create, or delete notices.

## Future roadmap
- [x] Create core CRUD functionality
- [x] Implement database-level priority sorting
- [x] Implement premium dark mode UI and glassmorphism styling
- [ ] Add user authentication (e.g., NextAuth) to restrict creation and deletion to admins
- [ ] Implement cloud storage (e.g., AWS S3 or Cloudinary) for direct image uploads
- [ ] Add pagination or infinite scrolling for the main feed
- [ ] Introduce full-text search and category filtering

## Contributing
Contributions are welcome! Follow these steps to submit a change:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/add-pagination`
3. Commit your changes: `git commit -m "feat: implement pagination on home page"`
4. Push to the branch: `git push origin feature/add-pagination`
5. Open a Pull Request

*We especially welcome contributions related to authentication, UI improvements, and test coverage.*

## License
This project is licensed under the **MIT License**.
You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software with minimal restrictions.
