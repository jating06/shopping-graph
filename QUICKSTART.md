# Quick Start Guide

Get your Shopping Graph application up and running in minutes!

## 🚀 Local Development (Fastest)

```bash
# 1. Clone the repository
git clone https://github.com/jating06/shopping-graph.git
cd shopping-graph

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
# Visit: http://localhost:3001
```

That's it! The application is now running locally.

## 🎯 Using the Application

### Demo Mode (Recommended for Testing)

1. Keep "Demo Mode" checkbox **checked** (default)
2. Click **"Start Tracking"**
3. Watch the live graph with simulated price data
4. See real-time updates every 5 seconds

### Real API Mode

1. **Uncheck** "Demo Mode"
2. Enter a valid product slug from [tiraz5.de](https://www.tiraz5.de)
   - Example: `lakme-enrich-matte-lipstick---shade-wm10-47g-t1899xdfjvvt`
3. Enter your 6-digit pincode (default: 110009)
4. Click **"Start Tracking"**
5. Monitor real product prices from Tira

### Finding Product Slugs

1. Visit [https://www.tiraz5.de](https://www.tiraz5.de)
2. Navigate to any product
3. Copy the last part of the URL

Example URL:
```
https://www.tiraz5.de/p/lakme-enrich-matte-lipstick---shade-wm10-47g-t1899xdfjvvt
```

Product slug:
```
lakme-enrich-matte-lipstick---shade-wm10-47g-t1899xdfjvvt
```

## 📊 Features Overview

- **Real-time Tracking**: Live price updates via WebSocket
- **Dual Price Display**: Shows both effective and marked prices
- **Price Statistics**: Min, max, average, and price changes
- **Demo Mode**: Test without making API calls
- **Price History**: Stores last 100 data points
- **Beautiful Charts**: Powered by Chart.js

## 🌐 Deploy to GitHub Pages

### Prerequisites
- GitHub account
- Repository pushed to GitHub

### Steps

1. **Enable GitHub Pages:**
   ```bash
   # Go to your repo on GitHub
   # Settings → Pages → Source: GitHub Actions
   ```

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Wait for deployment:**
   - Check the "Actions" tab on GitHub
   - Deployment takes ~2 minutes
   - Your site: `https://jating06.github.io/shopping-graph/`

4. **Deploy backend separately:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for backend options
   - Update `public/config.js` with your backend URL

## 🔧 Common Tasks

### Change Update Interval

```javascript
// In the UI: Update Interval field
// Default: 5 seconds
// Range: 2-300 seconds
```

### Clear Price History

```javascript
// Click "Clear History" button
// Resets all data and chart
```

### Stop Tracking

```javascript
// Click "Stop Tracking" button
// Pauses price updates
```

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill the process if needed
kill -9 <PID>

# Try again
npm start
```

### WebSocket connection fails

```bash
# Check server logs
# Ensure server is running
# Verify no firewall blocking
```

### No price data showing

1. Check if product slug is valid
2. Verify pincode is serviceable
3. Try Demo Mode instead
4. Check browser console for errors

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

## 🎨 Customization

### Change Default Product

Edit `public/index.html`:

```html
<input 
  type="text" 
  id="productSlug" 
  value="your-product-slug-here"
>
```

### Change Default Port

Edit `server.js`:

```javascript
const PORT = process.env.PORT || 3001; // Change 3001 to your port
```

Or use environment variable:

```bash
PORT=8080 npm start
```

### Modify Update Interval

Edit `public/index.html`:

```html
<input 
  type="number" 
  id="updateInterval" 
  value="5"  <!-- Change default seconds -->
>
```

## 💡 Tips

1. **Use Demo Mode first** to see how the app works
2. **Check product availability** before tracking
3. **Monitor console logs** for debugging
4. **Clear history** if graph gets too crowded
5. **Use longer intervals** to reduce API calls

## 🤝 Contributing

Found a bug or have a feature request?

1. Open an issue on GitHub
2. Submit a pull request
3. Share your feedback

## 📄 License

This project is open source. See LICENSE file for details.

---

**Happy Tracking! 📊✨**

