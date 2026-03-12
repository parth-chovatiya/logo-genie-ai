## LogoGenie AI (Next.js + Gemini + AWS S3)

AI-powered logo generator built with Next.js 14, TypeScript, Tailwind, shadcn/ui, Google Gemini, and AWS S3 for logo storage.

### Tech stack
- **Frontend**: Next.js App Router, React 18, Tailwind, shadcn/ui
- **Backend**: Next.js API routes (`app/api/*`), TypeScript
- **AI**: `@google/genai` (Gemini)
- **Storage**: AWS S3
- **ORM**: Drizzle ORM (Neon/Postgres ready, currently optional)

### Getting started (local)
1. Install deps:
   ```bash
   npm install
   ```
2. Copy env template and fill in real values (do **not** commit the real `.env`):
   ```bash
   cp .env.example .env
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

### Required environment variables
See `.env.example` for the full list; key ones:
- `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY` – Google Gemini API key
- `ACCESS_KEY` / `ACCESS_SECRET_KEY` (or standard `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)
- `AWS_REGION` – e.g. `us-east-1`
- `AWS_LOGO_BUCKET` – S3 bucket used to store generated logos

### Making this repo public safely
- Secrets live only in `.env` which is ignored via `.gitignore` (`*.env`).
- Before pushing, **rotate** any keys that were ever stored in `.env` (Gemini + AWS) and use the new ones only in your private envs (local, Vercel, etc.).
- Do **not** add `.env` (or any other secret files) to git history.

### Deploying (recommended: Vercel)
1. Push this repo to GitHub (private or public).
2. On Vercel, import the GitHub repo.
3. In the project settings → Environment Variables, add everything from `.env.example` with real values.
4. Vercel will run `npm install` and `npm run build` using the existing `package.json` scripts.
5. Once the first deploy succeeds, you can set the GitHub repo visibility to **Public**.

