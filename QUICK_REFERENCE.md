# 🎯 Quick Reference Card

## 📝 Your Project Info

| Item | Value |
|------|-------|
| **Sanity Project ID** | `21f3spns` |
| **Sanity Dataset** | `production` |
| **Studio Hostname** | (You'll choose this - e.g., `thescreeners`) |
| **Vercel Root Directory** | `frontend` |

---

## ⚡ Quick Commands

### Deploy Sanity Studio
```bash
cd studio-thescreeners
npx sanity deploy
```

### Push to GitHub (Auto-deploys to Vercel)
```bash
cd /Applications/MAMP/htdocs/34-Screeners/screen
git add .
git commit -m "Your message"
git push
```

### Local Development
```bash
# Frontend
cd frontend
npm run dev
# → http://localhost:3000

# Studio (separate terminal)
cd studio-thescreeners  
npm run dev
# → http://localhost:3333
```

---

## 🔑 Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=21f3spns
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_xxxxx (get from sanity.io)
```

---

## 🌐 Your URLs (After Deployment)

| What | URL | Notes |
|------|-----|-------|
| **Frontend** | `https://YOUR-PROJECT.vercel.app` | Main website |
| **Studio (proxy)** | `https://YOUR-PROJECT.vercel.app/studio` | Via Next.js proxy |
| **Studio (direct)** | `https://YOUR-HOSTNAME.sanity.studio` | Direct from Sanity |
| **Vercel Dashboard** | https://vercel.com | Manage deployments |
| **Sanity Dashboard** | https://sanity.io/manage | Manage CMS |

---

## ✅ Deployment Checklist

### Part 1: Sanity Studio
- [ ] Run `npx sanity login`
- [ ] Run `npx sanity deploy`
- [ ] Choose hostname (e.g., `thescreeners`)
- [ ] Get studio URL (e.g., `https://thescreeners.sanity.studio`)
- [ ] Test: Can you login to the studio?

### Part 2: GitHub
- [ ] Create repo on GitHub
- [ ] Run `git init` (if needed)
- [ ] Run `git add .`
- [ ] Run `git commit -m "Initial commit"`
- [ ] Run `git remote add origin YOUR_REPO_URL`
- [ ] Run `git push -u origin main`
- [ ] Verify: Code visible on GitHub?

### Part 3: Sanity API Token
- [ ] Go to: https://sanity.io/manage/personal/project/21f3spns
- [ ] Click API → Tokens → Add API token
- [ ] Name: `Vercel Production`
- [ ] Permissions: Editor
- [ ] Copy token (starts with `sk...`)
- [ ] Save it somewhere safe!

### Part 4: Vercel
- [ ] Go to https://vercel.com/new
- [ ] Import your GitHub repository
- [ ] Set Root Directory: `frontend`
- [ ] Add 3 environment variables (see above)
- [ ] Click Deploy
- [ ] Wait for build to complete
- [ ] Get Vercel URL
- [ ] Test: Does frontend load?

### Part 5: Configure Proxy
- [ ] Update `frontend/next.config.js`
- [ ] Replace `YOUR_STUDIO_HOSTNAME` with actual hostname
- [ ] Run `git add .`, `git commit`, `git push`
- [ ] Wait for Vercel to redeploy
- [ ] Test: Does `/studio` load?

### Part 6: CORS
- [ ] Go to Sanity Dashboard → API → CORS
- [ ] Add: `https://YOUR-PROJECT.vercel.app`
- [ ] Add: `https://YOUR-HOSTNAME.sanity.studio`
- [ ] Add: `http://localhost:3000`
- [ ] Check "Allow credentials" for each
- [ ] Test: Can you login to studio?

---

## 🔍 Where to Find Things

### Sanity API Token
```
https://sanity.io/manage/personal/project/21f3spns
→ API → Tokens → Add API token
```

### Vercel Environment Variables
```
https://vercel.com/YOUR-PROJECT
→ Settings → Environment Variables
```

### Sanity CORS Settings
```
https://sanity.io/manage/personal/project/21f3spns
→ API → CORS Origins
```

### Vercel Deployment Logs
```
https://vercel.com/YOUR-PROJECT
→ Deployments → Click on deployment → View Function Logs
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails** | Check Vercel logs, verify Root Directory = `frontend` |
| **/studio shows 404** | Update next.config.js, push to GitHub, wait for redeploy |
| **Can't login to studio** | Add domain to Sanity CORS origins |
| **Content not loading** | Check environment variables in Vercel |
| **CORS error** | Add all URLs to Sanity CORS origins with credentials |

---

## 📞 Important Links

- **Sanity Management:** https://sanity.io/manage/personal/project/21f3spns
- **Vercel Dashboard:** https://vercel.com
- **GitHub Repo:** (Add your URL here after creating)
- **Setup Guide:** [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Full Guide:** [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🎯 The Workflow

```
1. Make changes locally
2. git add . && git commit -m "message" && git push
3. Vercel auto-deploys (takes ~2 minutes)
4. Visit your site - changes are live! 🎉
```

For studio changes:
```
1. Make changes to studio-thescreeners/
2. npx sanity deploy
3. Studio updates immediately! 🎉
```

---

**Keep this file handy during setup!** 📌

Follow the detailed steps in [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

