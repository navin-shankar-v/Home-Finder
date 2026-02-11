# Roomies — Home Finder

**Roomies** is a web app for finding roommates and room rentals. Browse property listings (apartments, townhomes, houses), discover roommate profiles that match your lifestyle and budget, list your own room, or create a “Be a Roommater” profile so others can find you. Users can sign up, sign in, save favourites, and manage everything from a single dashboard.

---

## Features

- **Browse listings** — Search by city and property type (Apartment, Townhome, House), filter by price, view 100+ seeded listings across 10 cities.
- **Find roommates** — Browse 100+ roommate profiles with budget, move-in date, lifestyle preferences, and short bios.
- **List a room** — Logged-in users can publish a room with title, address, rent, amenities, house rules, and contact preferences.
- **Be a Roommater** — Create a roommate profile (age, occupation, city, budget range, lifestyle, bio) so others can connect with you.
- **Authentication** — Register (name, email, password with validation), sign in, email verification (optional SMTP), and session-based auth.
- **Dashboard** — Manage your room listings, your roommate profile, favourite listings, and favourite roommates in one place. Delete your own listings or profile, remove favourites.
- **Favourites** — Heart listings and roommate profiles when signed in; view and manage them under Dashboard.
- **How it works** — Landing section explaining search, connect, and list flows.
- **About us** — Mission, vision, and purpose of the platform.

---

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Wouter, TanStack Query.
- **Backend:** Node.js, Express 5, session-based auth (express-session), bcrypt for passwords.
- **Data:** In-memory storage (Drizzle schema for future DB); seed data for listings and roommates.

---

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run in development

Starts the Express server with Vite dev middleware on a single port (default **5000**). Open **http://localhost:5000**.

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run production build

```bash
npm start
```

### Type check

```bash
npm run check
```

---

## Environment variables (optional)

| Variable        | Description |
|----------------|-------------|
| `PORT`         | Server port (default: `5000`). |
| `NODE_ENV`     | `development` or `production`. |
| `SESSION_SECRET` | Secret for session cookies. |
| `BASE_URL`     | Base URL for email verification links (e.g. `http://localhost:5000`). |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_FROM` | For sending verification emails; if unset, the verify link is logged to the server console. |

---

## Project structure

```
├── client/           # React app (Vite)
│   └── src/
│       ├── components/   # UI and layout (navbar, footer, cards, Radix components)
│       ├── contexts/     # Auth context
│       ├── lib/          # API client, utils, queryClient
│       └── pages/        # Home, Listings, Roommates, Auth, Dashboard, etc.
├── server/           # Express API
│   ├── index.ts      # App and session setup
│   ├── routes.ts     # Auth, listings, roommates, favourites, me
│   ├── storage.ts    # In-memory storage
│   ├── seed.ts       # Seed data for listings and roommates
│   └── email.ts      # Verification email (nodemailer)
├── shared/
│   └── schema.ts     # Drizzle schema (users, listings, roommates)
└── package.json
```

---

## License

MIT
