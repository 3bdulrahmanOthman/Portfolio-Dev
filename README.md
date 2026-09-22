# 🌐 Full-Stack Developer Portfolio with Admin Dashboard

Modern developer portfolio with an integrated dashboard to manage projects, pages, and content — built for performance, customization, and scalability.

---

## 🚀 Tech Stack

### ✅ Frontend
- **Framework:** [Next.js 16](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)

### 🔐 Authentication
- **Library:** [Auth.js v5](https://authjs.dev/)
- **Method:** Email/Password login
- **Session Management:** Secure access to protected routes & server actions

### 🧠 Backend
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL via Prisma Accelerate (edge client)
- **Routing:** API endpoints via App Router
- **Server Actions:** Used for all data mutations and interactions

### 📤 File Upload
- **Provider:** [UploadThing](https://uploadthing.com/)
- **Feature:** Reusable upload component integrated with admin forms

---

## 💡 Features

- 🔐 **Admin Dashboard** (protected using Auth.js v5 sessions)
- 📝 **CRUD** operations for:
  - `/about`
  - `/projects`
  - `/contact`
- 📦 **Image/file upload** via UploadThing (drag-and-drop support)
- 🔁 **Server Actions** for secure server-side data mutations
- 🧪 **Zod validation** at both form and API level
- 🌐 **SEO-friendly** and accessible design

---

## ⚙️ Quality & Tooling

- ✅ TypeScript (strict mode)
- ✅ ESLint 9 (flat config) and CI quality gates (typecheck + lint via GitHub Actions)
- ✅ Error boundaries and safe API patterns
- ✅ Prisma schema with a generated edge client (migration baseline in progress)

---

## 🔧 Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/3bdulrahmanOthman/Portfolio-Dev.git
cd Portfolio-Dev
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment**

Create a `.env` file with the following:

```env
DATABASE_URL=postgresql://your-db-url
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret"
ADMIN_EMAIL="admin@mail.com"
NEW_ADMIN_PASSWORD="set-privately-then-run-scripts/rotate-admin-password.ts"
```

4. **Generate the Prisma client**

`pnpm install` runs `prisma generate` automatically via `postinstall`. There is
no migrations directory yet (baseline planned); the schema in `prisma/schema.prisma`
is the source of truth.

5. **Start the development server**

```bash
pnpm dev
```

---

## 📜 License

[MIT](LICENSE)
