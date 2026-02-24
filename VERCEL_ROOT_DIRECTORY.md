# Vercel deployment – required setting

**You must set the Root Directory in Vercel so the build uses the Next.js app.**

1. Open your project on [vercel.com](https://vercel.com).
2. Go to **Settings** → **General**.
3. Find **Root Directory**.
4. Click **Edit**.
5. Enter: **`frontend`** (no slash, no extra path).
6. Click **Save**.
7. **Redeploy**: Deployments → … on latest deployment → **Redeploy** (optionally enable “Clear cache and redeploy”).

The Next.js app and its `package.json` (with `next`) live in the `frontend` folder. If Root Directory is left empty, Vercel uses the repo root and you get: *“No Next.js version detected”*.
