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
2. In the project, open **SQL Editor > New query**, paste the whole of `supabase/migrations/001_init.sql`, and press **Run**. Then run `supabase/migrations/002_groups.sql` the same way if you want **study groups** (in addition to 1:1 Together pairing).
3. Open **Project Settings > API**. Copy the **Project URL** and the **anon public key**.
4. Copy `.env.example` to `.env.local` and fill in the two Supabase values only (do **not** put `NEXT_PUBLIC_SITE_URL` in `.env.local` — it overrides production builds and breaks magic links on Workers).
5. Open **Authentication > URL Configuration**. Set **Site URL** to your live address (for example `https://journey-to-purity.kenkibira11.workers.dev`) and add these to **Redirect URLs**:
   - `http://localhost:3000/login`
   - `https://journey-to-purity.kenkibira11.workers.dev/login`
   - `https://journey-to-purity.kenkibira11.workers.dev/**` (optional wildcard for the same host)
6. Restart `npm run dev`. Open **Account**, enter your email, and tap the link you receive.

**If sign-in says it cannot reach your account server:** open the Supabase dashboard and make sure the project is **not paused** (paused projects are unreachable and show “Failed to fetch” in the app). Click **Resume project** if needed.

### Sign in with Google (optional)

Until this is done, **Continue with Google** shows “provider is not enabled” from Supabase.

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials** → create an **OAuth client ID** (Web application).
2. **Authorized redirect URI:** `https://fwpgzyuinjmwxlsnqeyx.supabase.co/auth/v1/callback` (use your project ref if different).
3. Supabase → **Authentication** → **Providers** → **Google** → turn **Enable Sign in with Google** on → paste Client ID + Client secret → **Save**.
4. The app’s **Continue with Google** button on Account uses the same redirect URL as email links (`/login`).

**“email rate limit exceeded”:** Supabase’s built-in mailer on the free plan only allows a few magic-link emails per hour. Wait ~1 hour after heavy testing, or set up **Authentication → Emails → SMTP** with your own provider.

Then one of you opens **Together > Create my invite code**, sends it, and the other enters it under **I have a code**.

### What your friend can and cannot see

| Visible to your friend | Never visible unless you choose |
| --- | --- |
| Which steps you have sealed | Your journal entries (unless you tick "share") |
| Your check-in answers (walked, wavered, fell) | The note on a check-in (unless you tick "let my friend read this") |
| Your study-plan progress | Your email address |

This is enforced by Postgres row-level security in `001_init.sql`, not only by the app.

## Put it online (Cloudflare Workers)

This repo is set up for [OpenNext on Cloudflare](https://opennext.js.org/cloudflare/get-started).

1. Push to GitHub (already done if you are reading this from a clone).
2. Fill in `.env.local` (and `.dev.vars` for preview) with your Supabase URL, anon key, and `NEXT_PUBLIC_SITE_URL` (your Workers URL in production).
3. Log in: `npx wrangler login`
4. Deploy: `npm run deploy`
5. In Supabase **Authentication > URL configuration**, set **Site URL** to your Workers URL (not `localhost`) and add `https://<your-url>/login` to **Redirect URLs**. If email links still open `localhost`, the Site URL in Supabase was never updated.

**Git-connected deploys:** Cloudflare dashboard → **Workers & Pages** → connect the repo. Build command: `npx opennextjs-cloudflare build`. Deploy command: `npx opennextjs-cloudflare deploy`. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` (your `https://….workers.dev` address, no trailing slash) in the project settings, then redeploy so magic links use the live URL.

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
| `content/crossroads.ts` | Choose-your-path scenarios |
| `content/armor.ts` | The Armor of God game |
| `content/questions.ts`, `testimonies.ts`, `plans.ts`, `help.ts` | Library, testimonies, study plans, help resources |
| `content/art.ts`, `public/art/` | Artwork, credits, and the story behind each piece |
| `lib/credits.ts` | Translation credits and tools, shown on the `/credits` page with the art and science sources |
| `components/StageScene.tsx` | The custom illustrations for each stage |
| `app/manifest.ts`, `app/icons/`, `app/icon.tsx`, `app/apple-icon.tsx` | Install-to-home-screen manifest and generated icons |
| `public/sw.js`, `components/PwaRegister.tsx` | Offline support (production only) |
| `supabase/migrations/001_init.sql` | Database, privacy rules, pairing functions |
| `supabase/migrations/002_groups.sql` | Study progress sync and Bible study groups |
| `content/studies.ts` | Group-capable Bible studies (solo or online) |

## Adding or editing content

- **Add a verse reference** anywhere in `content/` as a whole string such as `"Romans 12:2"`, then run `npm run verses` to fetch the KJV and WEB text.
- **Add artwork**: add `{ id, title }` to `scripts/fetch-art.mjs`, run `npm run art`, then describe it in `content/art.ts`.
- **Add exact questions from your notebook**: add entries to `content/questions.ts` (the current 25 were written from the themes of the brief).
- **Check every link** in the content: `npm run links`. 403/429 results are sites that block bots; open those by hand. Run it from a normal internet connection, since a flaky one reports false "dead" links.
- **Shrink new artwork** before committing it: `npm run optimize-art` (resizes to 1600px wide and recompresses).

## Checking your work

```bash
npm run typecheck
npm run build           # all pages must generate
npm run dev             # then, in another terminal:
npm run auth-smoke      # Supabase + login page checks
npm start               # or after build:
node scripts/a11y.mjs / /journey /play /flee    # axe-core accessibility audit
node scripts/shots.mjs /play /flee              # screenshots into .shots/
```

Stop `npm run dev` before running `npm run build`: both write to `.next` and will corrupt each other.

## Install on a phone

In production the site is an installable app. On Android, Chrome offers "Install app". On iPhone, use Safari, Share, **Add to Home Screen**. Pages you have opened keep working offline, and the Flee page is always cached.

## Scripture and art credits

- KJV and WEB are public domain.
- Short quotations from the ESV, NIV and NKJV are used within each publisher's permitted limits and credited where they appear.
- Artwork is public domain unless the Gallery says otherwise, with source links to Wikimedia Commons.
