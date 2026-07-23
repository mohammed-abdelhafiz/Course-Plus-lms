# Course+

A full-stack Learning Management System (LMS) built with **Next.js 16**, **React 19**, and **PostgreSQL**. Instructors can create, manage, and monetize courses with video content, while students can browse, purchase, and track their progress through chapters.

---

## Features

### Student Experience

- **Browse & Search** — filter courses by category and keyword with full-text search
- **Purchase Courses** — integrated Stripe checkout for paid courses
- **Video Playback** — stream chapters via Mux with progress tracking
- **Progress Tracking** — per-chapter completion status with a visual progress bar
- **Confetti Celebration** — fun confetti animation on course completion
- **Student Dashboard** — view enrolled courses split into "In Progress" and "Completed"

### Teacher / Instructor Experience

- **Course Builder** — create courses with title, description, image, price, and category
- **Chapter Management** — add, reorder (drag & drop), and configure chapters
- **Video Uploads** — upload chapter videos processed by Mux for adaptive streaming
- **File Attachments** — attach supplementary resources to courses via UploadThing
- **Publish / Unpublish** — control course and chapter visibility
- **Analytics Dashboard** — view revenue and sales data with interactive charts

---

## Tech Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| **Framework**   | Next.js 16 (App Router)                      |
| **Language**    | TypeScript                                   |
| **Styling**     | Tailwind CSS v4                              |
| **UI**          | shadcn/ui, Base UI, Lucide icons             |
| **Auth**        | Clerk                                        |
| **Database**    | PostgreSQL via Prisma ORM                    |
| **Payments**    | Stripe (checkout + webhooks)                 |
| **Video**       | Mux (upload, processing, player)             |
| **File Upload** | UploadThing                                  |
| **State**       | Zustand                                      |
| **Forms**       | React Hook Form + Zod validation             |
| **Charts**      | Recharts                                     |
| **Rich Text**   | React Quill                                  |
| **DnD**         | @hello-pangea/dnd                            |
| **Toasts**      | react-hot-toast                              |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                  # Clerk sign-in / sign-up pages
│   ├── (course)/courses/        # Course player & chapter view
│   ├── (dashboard)/
│   │   ├── (routes)/
│   │   │   ├── (root)/          # Student dashboard
│   │   │   ├── search/          # Browse & search courses
│   │   │   └── teacher/
│   │   │       ├── courses/     # Course & chapter CRUD
│   │   │       └── analytics/   # Revenue & sales charts
│   │   └── _components/         # Sidebar, navbar, mobile nav
│   └── api/
│       ├── courses/             # Course & chapter REST endpoints
│       ├── uploadthing/         # File upload route
│       └── webhook/             # Stripe webhook handler
├── actions/                     # Server-side data fetching
├── components/                  # Shared UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities (DB client, Stripe, helpers)
└── generated/                   # Prisma generated client
prisma/
├── schema.prisma                # Database models
├── migrations/                  # SQL migration history
└── seed.ts                      # Category seed script
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or pnpm / yarn / bun)
- **PostgreSQL** database
- Accounts for: **Clerk**, **Stripe**, **Mux**, **UploadThing**

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# UploadThing
UPLOADTHING_TOKEN=

# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# Stripe
STRIPE_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

Optionally seed categories:

```bash
npx prisma db seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Stripe webhooks (local development)

In a separate terminal, forward Stripe events to your local webhook endpoint:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

---

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the development server       |
| `npm run build`     | Create a production build          |
| `npm run start`     | Run the production server          |
| `npm run lint`      | Run ESLint                         |

---

## Database Models

| Model              | Purpose                                         |
| ------------------- | ------------------------------------------------ |
| **Course**          | Top-level course entity with metadata and pricing |
| **Category**        | Course categorization                            |
| **Chapter**         | Ordered lessons within a course                  |
| **Attachment**      | Downloadable files attached to a course          |
| **MuxData**         | Mux asset and playback IDs for chapter videos    |
| **UserProgress**    | Per-user chapter completion tracking             |
| **Purchase**        | Records of course purchases                      |
| **StripeCustomer**  | Maps users to their Stripe customer IDs          |

---

## License

This project is private and not licensed for redistribution.
