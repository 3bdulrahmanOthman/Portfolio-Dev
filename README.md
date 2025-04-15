# 🌐 Full-Stack Developer Portfolio with Admin Dashboard

Modern developer portfolio with an integrated dashboard to manage projects, pages, and content — built for performance, customization, and scalability.

---

## 🚀 Tech Stack

### ✅ Frontend
- **Framework:** [Next.js 15](https://nextjs.org/)
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
- **Database:** PostgreSQL (PlanetScale or other provider)
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
- ✅ ESLint & Prettier configured
- ✅ Error boundaries and safe API patterns
- ✅ Prisma schema and migration scripts included

---

## 🔧 Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/3bdulrahmanOthman/Portfolio-Dev.git
cd your-repo-name
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
ADMIN_PASSWORD="123456"
```

4. **Run migrations**

```bash
npx prisma migrate dev
```

5. **Start the development server**

```bash
pnpm dev
```

---

## 📜 License

[MIT](LICENSE)
