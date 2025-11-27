# Deployment Guide

This guide covers deploying the Shopping Graph application to various platforms.

## Architecture

The application consists of two parts:
1. **Frontend** - Static HTML/CSS/JS files (can be hosted on GitHub Pages)
2. **Backend** - Node.js server with WebSocket support (requires a Node.js hosting platform)

## Option 1: GitHub Pages (Frontend) + Backend Service

### Step 1: Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
   - The workflow is already configured in `.github/workflows/deploy.yml`

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

3. **Access your site:**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/shopping-graph/`
   - Check the Actions tab to see deployment progress

### Step 2: Deploy Backend

Choose one of the following platforms for the backend:

#### Option A: Heroku

1. **Install Heroku CLI:**
   ```bash
   brew install heroku/brew/heroku  # macOS
   # or visit https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create your-shopping-graph-backend
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **Get your backend URL:**
   ```bash
   heroku open
   # Your backend URL will be: https://your-shopping-graph-backend.herokuapp.com
   ```

#### Option B: Railway

1. **Visit [railway.app](https://railway.app)**

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js and deploy

3. **Configure:**
   - Add environment variable: `PORT` (Railway provides this automatically)
   - Generate domain in Settings

4. **Get your backend URL:**
   - Copy the generated domain (e.g., `your-app.railway.app`)

#### Option C: Render

1. **Visit [render.com](https://render.com)**

2. **Create new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `shopping-graph-backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: Free

3. **Deploy:**
   - Render will automatically deploy
   - Get your URL from the dashboard (e.g., `https://shopping-graph-backend.onrender.com`)

#### Option D: Fly.io

1. **Install Fly CLI:**
   ```bash
   brew install flyctl  # macOS
   # or visit https://fly.io/docs/hands-on/install-flyctl/
   ```

2. **Login and launch:**
   ```bash
   fly auth login
   fly launch
   ```

3. **Deploy:**
   ```bash
   fly deploy
   ```

4. **Get your URL:**
   ```bash
   fly status
   ```

### Step 3: Connect Frontend to Backend

After deploying the backend, update the frontend configuration:

1. **Update config.js:**
   
   Edit `public/config.js` and replace the backend URL:
   
   ```javascript
   if (hostname.includes('github.io')) {
     const backendUrl = 'wss://your-backend.herokuapp.com'; // Replace with your backend URL
     return backendUrl;
   }
   ```

2. **Commit and push:**
   ```bash
   git add public/config.js
   git commit -m "Update backend URL for production"
   git push origin main
   ```

3. **Wait for GitHub Actions to redeploy** (usually takes 1-2 minutes)

## Option 2: Full Stack Deployment (Single Platform)

### Heroku (Full Stack)

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-shopping-graph

# Deploy
git push heroku main

# Open app
heroku open
```

Your app will be available at: `https://your-shopping-graph.herokuapp.com`

### Railway (Full Stack)

1. Visit [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Railway auto-detects and deploys
4. Access via generated domain

### Render (Full Stack)

1. Visit [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Configure as described above
5. Access via generated URL

## Option 3: Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Access at
http://localhost:3001
```

## Environment Variables

The application uses these environment variables:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Configuration Files

- `.github/workflows/deploy.yml` - GitHub Actions workflow for deployment
- `public/config.js` - Frontend configuration for different environments
- `server.js` - Backend server configuration

## Troubleshooting

### Frontend can't connect to backend

1. Check that backend is running and accessible
2. Verify WebSocket URL in browser console
3. Ensure backend URL in `config.js` is correct
4. Check for CORS issues (backend should allow your frontend domain)

### WebSocket connection fails

1. Ensure backend supports WebSocket connections
2. Check if platform requires WebSocket configuration
3. Verify SSL/TLS settings (use `wss://` for HTTPS sites)

### GitHub Pages deployment fails

1. Check Actions tab for error logs
2. Ensure workflow file is in `.github/workflows/`
3. Verify GitHub Pages is enabled in repository settings

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed to GitHub Pages
- [ ] Backend URL updated in `config.js`
- [ ] WebSocket connection working
- [ ] Demo mode tested
- [ ] Real API mode tested
- [ ] SSL/TLS configured (HTTPS)
- [ ] Error handling tested
- [ ] Performance optimized

## Monitoring

### Backend Health Check

Add this endpoint to `server.js`:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### Frontend Monitoring

Check browser console for:
- WebSocket connection status
- API response times
- Error messages

## Scaling

For high traffic:

1. **Backend:**
   - Use Redis for session storage
   - Implement rate limiting
   - Add load balancing
   - Use CDN for static assets

2. **Frontend:**
   - Enable caching
   - Minimize bundle size
   - Use service workers
   - Implement lazy loading

## Security

1. **API Keys:**
   - Move sensitive data to environment variables
   - Never commit API keys to repository
   - Use secrets management service

2. **CORS:**
   - Configure allowed origins
   - Implement proper authentication
   - Use HTTPS only in production

3. **Rate Limiting:**
   - Implement on backend
   - Prevent abuse
   - Monitor usage

## Cost Optimization

### Free Tier Options

- **GitHub Pages:** Free for public repositories
- **Railway:** $5/month credit (free tier available)
- **Render:** Free tier with limitations
- **Fly.io:** Free tier with 3 VMs

### Recommendations

- Start with free tiers
- Monitor usage
- Upgrade as needed
- Use caching to reduce API calls

## Support

For issues or questions:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Open an issue on GitHub
- Review deployment logs

