# Vercel deployment – required setting

**You must set the Root Directory in Vercel.** Without this, you get: *"No Next.js version detected"*.

## Steps

1. Go to [vercel.com](https://vercel.com) → your project
2. **Settings** (top tab) → **General**
3. Scroll to **Root Directory**
4. Click **Edit**
5. Enter exactly: **`frontend`** (no slash, no path)
6. Click **Save**
7. **Redeploy**: **Deployments** → ⋯ on latest → **Redeploy** (use **Clear cache and redeploy** if available)

## Why

The Next.js app is in the `frontend/` folder. If Root Directory is empty, Vercel uses the repo root and cannot find Next.js. Setting it to `frontend` makes Vercel use the correct `package.json` and run install/build in the right place.
