# Home-Finder (Roomies) — Project status & future work

## Current stage

### ✅ Done

- **Clerk authentication (full migration)**
  - Frontend: `@clerk/clerk-react` with `ClerkProvider`, `SignIn`/`SignUp`, `UserButton`, `SignedIn`/`SignedOut`.
  - Backend: `@clerk/express` with `clerkMiddleware()`, `getAuth(req).userId` for all protected routes.
  - API requests send Clerk JWT via `Authorization: Bearer` (token from `getToken()`).
  - No express-session, bcrypt, or custom auth routes; no `/api/auth/*` or auth context.

- **Core features**
  - Browse listings (search by city, property type; filter by price).
  - Browse roommates (filters, lifestyle).
  - List a room (auth required; Clerk).
  - Be a Roommater profile (auth required; Clerk).
  - Dashboard: my listings, my roommate profile, favourite listings/roommates; delete/remove.
  - Favourites: heart listings and roommates when signed in; all keyed by Clerk `user.id`.
  - How it works, About us, Home.

- **Tech**
  - React 19, TypeScript, Vite, Tailwind, Radix UI, Wouter, TanStack Query.
  - Express 5, in-memory storage (MemStorage), Drizzle schema in `shared/schema.ts`.
  - Env: `client/.env.local` for Clerk keys; server loads it + fallback for `CLERK_PUBLISHABLE_KEY`.

---

## Future work (prioritised)

### 1. Documentation & cleanup

- **Update README.md**  
  - Describe Clerk auth (not session/bcrypt).  
  - Env table: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`; remove `SESSION_SECRET`, `BASE_URL`, SMTP.  
  - Project structure: remove `contexts/` and `server/email.ts`; note Clerk + `server/routes.ts`.

- **Remove unused dependencies**  
  - From `package.json`: `bcrypt`, `@types/bcrypt`, `express-session`, `@types/express-session`, `nodemailer`, `@types/nodemailer`, `passport`, `passport-local`, `@types/passport*`, `connect-pg-simple`, `@types/connect-pg-simple`, `memorystore` (if not used elsewhere).  
  - Run `npm install` and re-check build/tests.

### 2. Persistence (database)

- **Wire storage to PostgreSQL**  
  - Drizzle is configured (`drizzle.config.ts`, `shared/schema.ts`).  
  - Add `DATABASE_URL` to env; implement or switch to a Drizzle-based storage adapter.  
  - Replace in-memory storage in `server/storage.ts` with DB (listings, roommates, favourites; optionally remove or repurpose legacy `users` table now that Clerk is the source of truth).  
  - Run migrations (`db:push` or migration scripts).

### 3. Product & UX

- **Listing detail page**  
  - Dedicated page for a single listing (e.g. `/listings/:id`) with full details and owner/contact.

- **Roommate detail page**  
  - Dedicated page for a roommate profile (e.g. `/roommates/:id`).

- **Messaging or contact**  
  - Way for users to contact listing owners or roommates (e.g. “Contact” button, optional messaging or mailto).

- **Search & filters**  
  - Improve listing/roommate search (e.g. more filters, URL state, accessibility).

- **Image upload**  
  - Replace placeholder image URLs with real uploads (e.g. S3/R2 + presigned URLs or similar).

### 4. Reliability & ops

- **Error handling**  
  - Consistent API error shape; frontend handling for 401/403/404 and toasts.

- **Validation**  
  - Request validation (e.g. Zod) for API bodies/params using `shared/schema.ts` where applicable.

- **Production env**  
  - Document production env (Clerk production keys, `NODE_ENV`, `PORT`, `DATABASE_URL`, etc.).

### 5. Optional enhancements

- **Clerk webhooks**  
  - Sync or react to user lifecycle (e.g. delete user data when user is deleted in Clerk).

- **Analytics**  
  - Optional analytics for key flows (listings viewed, favourites, sign-ups).

- **Tests**  
  - Unit tests for storage and routes; integration tests for auth and protected endpoints.

- **Accessibility & SEO**  
  - Audit a11y (focus, ARIA, contrast); meta tags and structure for listing/roommate pages.

---

## Quick reference

| Area            | Status        | Next step                          |
|-----------------|---------------|------------------------------------|
| Auth            | Clerk only    | Optional: webhooks, cleanup deps   |
| Storage         | In-memory     | Add PostgreSQL + Drizzle adapter   |
| README / docs   | Outdated      | Update for Clerk and env           |
| Listings        | List + create | Detail page, contact, image upload|
| Roommates       | List + create | Detail page, contact               |
| Favourites      | Working       | —                                  |
| Dashboard       | Working       | —                                  |
