# 🚀 Deployment Checklist

Use this checklist to deploy your Shopping Graph application to GitHub Pages.

## Phase 1: Pre-Deployment ✅

- [ ] All code changes committed locally
- [ ] Application tested locally (`npm start`)
- [ ] Demo mode working
- [ ] Real API mode working
- [ ] No console errors in browser

## Phase 2: GitHub Pages Setup 🌐

- [ ] Repository exists on GitHub: `https://github.com/jating06/shopping-graph`
- [ ] Code pushed to `main` branch
- [ ] Go to repository Settings
- [ ] Navigate to Pages section
- [ ] Set Source to "GitHub Actions"
- [ ] Save settings

## Phase 3: Deploy Frontend 📤

- [ ] Push code to GitHub:
  ```bash
  git add .
  git commit -m "Add GitHub Pages deployment"
  git push origin main
  ```
- [ ] Go to Actions tab on GitHub
- [ ] Wait for workflow to complete (green checkmark)
- [ ] Visit: `https://jating06.github.io/shopping-graph/`
- [ ] Verify frontend loads (may show connection error - that's OK)

## Phase 4: Deploy Backend 🖥️

Choose ONE option:

### Option A: Heroku
- [ ] Install Heroku CLI
- [ ] Login: `heroku login`
- [ ] Create app: `heroku create jating06-shopping-graph`
- [ ] Deploy: `git push heroku main`
- [ ] Note your URL: `https://jating06-shopping-graph.herokuapp.com`

### Option B: Railway
- [ ] Visit [railway.app](https://railway.app)
- [ ] Sign in with GitHub
- [ ] New Project → Deploy from GitHub
- [ ] Select `shopping-graph` repository
- [ ] Wait for deployment
- [ ] Copy generated URL

### Option C: Render
- [ ] Visit [render.com](https://render.com)
- [ ] New + → Web Service
- [ ] Connect GitHub repo
- [ ] Build: `npm install`
- [ ] Start: `npm start`
- [ ] Deploy and copy URL

## Phase 5: Connect Frontend & Backend 🔗

- [ ] Open `public/config.js` in your editor
- [ ] Find this line:
  ```javascript
  const backendUrl = window.BACKEND_URL || 'ws://localhost:3001';
  ```
- [ ] Replace with your backend URL:
  ```javascript
  const backendUrl = 'wss://your-backend-url.herokuapp.com';
  ```
  ⚠️ Use `wss://` (not `ws://`) for HTTPS backends
- [ ] Save the file
- [ ] Commit changes:
  ```bash
  git add public/config.js
  git commit -m "Update backend URL for production"
  git push origin main
  ```
- [ ] Wait for GitHub Actions to redeploy (~2 minutes)

## Phase 6: Testing 🧪

- [ ] Visit: `https://jating06.github.io/shopping-graph/`
- [ ] Open browser console (F12)
- [ ] Check for connection messages
- [ ] Test Demo Mode:
  - [ ] Check "Demo Mode" checkbox
  - [ ] Click "Start Tracking"
  - [ ] Verify graph updates
  - [ ] See price statistics
- [ ] Test Real API Mode:
  - [ ] Uncheck "Demo Mode"
  - [ ] Enter product slug
  - [ ] Enter pincode
  - [ ] Click "Start Tracking"
  - [ ] Verify real data loads
- [ ] Test Stop button
- [ ] Test Clear History button
- [ ] Check mobile responsiveness

## Phase 7: Verification ✔️

- [ ] No errors in browser console
- [ ] WebSocket connection established
- [ ] Prices updating in real-time
- [ ] Chart rendering correctly
- [ ] Statistics showing
- [ ] Product info displaying
- [ ] All buttons working

## Troubleshooting 🔧

If something doesn't work:

### Frontend not loading
- [ ] Check GitHub Actions completed successfully
- [ ] Verify GitHub Pages is enabled
- [ ] Wait a few minutes and refresh

### WebSocket connection failed
- [ ] Verify backend is running
- [ ] Check backend URL in `config.js`
- [ ] Ensure using `wss://` for HTTPS
- [ ] Check CORS settings in `server.js`

### Backend not responding
- [ ] Check backend platform dashboard
- [ ] Verify deployment succeeded
- [ ] Check backend logs
- [ ] Test backend URL directly

### Price data not showing
- [ ] Try Demo Mode first
- [ ] Verify product slug is valid
- [ ] Check pincode is serviceable
- [ ] Review browser console errors

## Quick Commands Reference 📝

```bash
# Local development
npm start

# Add and commit changes
git add .
git commit -m "Your message"

# Push to GitHub
git push origin main

# Deploy to Heroku
git push heroku main

# Check Heroku logs
heroku logs --tail

# Open deployed app
heroku open
```

## Success! 🎉

When everything is checked:

✅ Frontend live at: `https://jating06.github.io/shopping-graph/`
✅ Backend running and connected
✅ Demo mode working
✅ Real API mode working
✅ No console errors

## Next Steps 🎯

- [ ] Share your deployed app
- [ ] Add custom domain (optional)
- [ ] Set up monitoring
- [ ] Add analytics (optional)
- [ ] Customize branding
- [ ] Add more features

## Resources 📚

- **Setup Guide**: `GITHUB_PAGES_SETUP.md`
- **Full Deployment**: `DEPLOYMENT.md`
- **Quick Start**: `QUICKSTART.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **Main Docs**: `README.md`

---

**Happy Deploying! 🚀**

*Last updated: November 27, 2025*

