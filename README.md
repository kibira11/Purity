# The Journey to Purity

A beautiful, game-like web app for walking out of bondage (pornography, masturbation, fornication, alcohol, weed and other drugs) and into freedom, with a friend beside you. Eight stages follow Israel's road from Egypt to Zion. Each step brings Scripture, honest psychology, a body practice, a challenge, a journal prompt, and a game.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. Everything works right away, saved on your device. Connecting accounts (below) is optional and only needed to walk together online.

## Connect accounts (walk together online)

This takes about ten minutes and is free.

1. Go to https://supabase.com and create a free project.
2. In the project, open **SQL Editor > New query**, paste the whole of `supabase/migrations/001_init.sql`, and press **Run**.
3. Open **Project Settings > API**. Copy the **Project URL** and the **anon public key**.
4. Copy `.env.example` to `.env.local` and fill in the two values.
5. Open **Authentication > URL Configuration**. Set **Site URL** to your live address (for example `https://your-site.vercel.app`) and add these to **Redirect URLs**:
   - `http://localhost:3000/login`
   - `https://your-site.vercel.app/login`
6. Restart `npm run dev`. Open **Account**, enter your email, and tap the link you receive.

Then one of you opens **Together > Create my invite code**, sends it, and the other enters it under **I have a code**.

### What your friend can and cannot see

| Visible to your friend | Never visible unless you choose |
| --- | --- |
| Which steps you have sealed | Your journal entries (unless you tick "share") |
| Your check-in answers (walked, wavered, fell) | The note on a check-in (unless you tick "let my friend read this") |
| Your study-plan progress | Your email address |

This is enforced by Postgres row-level security in `001_init.sql`, not only by the app.

## Put it online (Vercel)

1. Push this folder to a GitHub repository.
2. On https://vercel.com choose **Add New > Project** and import it.
3. Under **Environment Variables** add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Add the final address to Supabase's **Redirect URLs** (step 5 above).

## Where things live

| Path | What it is |
| --- | --- |
| `content/stages.ts` | The eight stages |
| `content/stages/*.ts` | Every step: verse, revelation, golden thread, voices, mind and brain, body practice, challenge, reflection, game |
| `content/verses.json` | KJV and WEB text, filled by `npm run verses` |
| `content/modern.ts` | Short ESV/NIV/NKJV quotations used where they clarify |
| `content/crossroads.ts`, `content/crossroads-data.ts` | Choose-your-path scenarios |
| `content/questions.ts`, `testimonies.ts`, `plans.ts`, `help.ts` | Library, testimonies, study plans, help resources |
| `content/art.ts`, `public/art/` | Artwork, credits, and the story behind each piece |
| `components/StageScene.tsx` | The custom illustrations for each stage |
| `supabase/migrations/001_init.sql` | Database, privacy rules, pairing functions |

## Adding or editing content

- **Add a verse reference** anywhere in `content/` as a whole string such as `"Romans 12:2"`, then run `npm run verses` to fetch the KJV and WEB text.
- **Add artwork**: add `{ id, title }` to `scripts/fetch-art.mjs`, run `npm run art`, then describe it in `content/art.ts`.
- **Check every link** in the content: `npm run links`.

## Scripture and art credits

- KJV and WEB are public domain.
- Short quotations from the ESV, NIV and NKJV are used within each publisher's permitted limits and credited where they appear.
- Artwork is public domain unless the Gallery says otherwise, with source links to Wikimedia Commons.
