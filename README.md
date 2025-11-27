# Shopping Graph - Live Product Price Tracker

A real-time product price tracking application that monitors Tira product prices and displays them in a live graph.

## Features

- 📊 Real-time price tracking with live graph visualization
- 🔄 WebSocket-based updates for instant price changes
- 📈 Dual-line chart showing both effective and marked prices
- 📉 Price statistics (min, max, average, change)
- 🎨 Beautiful, modern UI with responsive design
- 💾 Price history storage (last 100 data points per product)
- ⚙️ Configurable update intervals

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. **Option A - Demo Mode (Recommended for Testing):**
   - Check the "Demo Mode" checkbox
   - Click "Start Tracking" to see simulated price changes
   - This will show you how the graph works with realistic data

4. **Option B - Real API Mode:**
   - Enter a valid product slug from Tira
   - Note: The product must be serviceable at the configured location (Delhi, 110009)
   - Set your desired update interval (in seconds)
   - Click "Start Tracking" to begin monitoring

## Important Notes

✅ **Real API Working:** The application now successfully connects to Tira's API with all required headers and cookies!

🎯 **Two Modes Available:**
1. **Real API Mode** - Track actual product prices from Tira
2. **Demo Mode** - Simulated data for testing without API calls

⚠️ **API Notes:**
- The API requires specific cookies and headers (all configured)
- Products must be serviceable at the configured location (Delhi, 110009)
- The default product slug works and returns real price data
- You can change the location in `server.js` if needed

## Finding Valid Product Slugs

To get valid product slugs:
1. Visit https://www.tiraz5.de
2. Navigate to any product page
3. The slug is the last part of the URL
4. Example: `https://www.tiraz5.de/p/lakme-enrich-matte-lipstick---shade-wm10-47g-t1899xdfjvvt`
   - Slug: `lakme-enrich-matte-lipstick---shade-wm10-47g-t1899xdfjvvt`

## API Endpoints

### POST `/api/price`
Fetch current price for a product
```json
{
  "slug": "product-slug-here"
}
```

### GET `/api/history/:slug`
Get price history for a specific product

## WebSocket Events

### Client → Server
```json
{
  "action": "start",
  "slug": "product-slug",
  "interval": 10000
}
```

```json
{
  "action": "stop"
}
```

### Server → Client
```json
{
  "type": "price-update",
  "data": {
    "timestamp": "2025-11-21T...",
    "data": { ... },
    "slug": "product-slug"
  }
}
```

## Technology Stack

- **Backend**: Node.js, Express, WebSocket (ws)
- **Frontend**: Vanilla JavaScript, Chart.js
- **HTTP Client**: Axios

## Configuration

The application uses the following default configuration:
- Port: 3000
- Default update interval: 10 seconds
- Maximum history per product: 100 entries
- Chart display limit: 50 data points

## Project Structure

```
shopping-graph/
├── server.js           # Express server with WebSocket
├── package.json        # Dependencies and scripts
├── README.md          # Documentation
└── public/
    ├── index.html     # Main HTML page
    ├── styles.css     # Styling
    └── app.js         # Frontend JavaScript
```

## Notes

- The application connects to Tira's API using the provided authorization token
- Price data is stored in memory and will be lost on server restart
- WebSocket connection automatically reconnects on disconnect
- The graph shows the last 50 data points for better visibility

