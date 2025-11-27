const express = require('express');
const axios = require('axios');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const https = require('https');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store price history for each product
const priceHistory = new Map();

// Active monitoring sessions
const activeMonitors = new Map();

// Create axios instance with SSL handling
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // Bypass SSL certificate verification
  })
});

// Fetch price from Tira API
async function fetchProductPrice(slug, pincode = '110009') {
  try {
    const response = await axiosInstance.post(
      'https://www.tiraz5.de/api/service/application/catalog/v1.0/products/sizes/price',
      {
        items: [
          {
            slug: slug,
            size: 'OS'
          }
        ]
      },
      {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'authorization': 'Bearer NjJjNDUwM2IwYjJlOTcxMWQ5OWI4NWFhOmtXRDFWeks4Yg==',
          'content-type': 'application/json',
          'origin': 'https://www.tiraz5.de',
          'priority': 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
          'x-currency-code': 'INR',
          'x-fp-date': '20251118T123952Z',
          'x-fp-sdk-version': '1.10.6-6',
          'x-fp-signature': 'v1.1:8bfe113eef9e085074c6e9eb278eb1ce6b484d7822ba5610f124d830b95c7f7d',
          'x-location-detail': `{"country":"INDIA","city":"DELHI","pincode":"${pincode}"}`,
          'Cookie': 'anonymous_id=854a2577d24b49d1a6743d504c36cf68; old_browser_anonymous_id=854a2577d24b49d1a6743d504c36cf68'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching price:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// API endpoint to get current price
app.post('/api/price', async (req, res) => {
  const { slug, pincode } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'Product slug is required' });
  }

  try {
    const data = await fetchProductPrice(slug, pincode);
    
    const timestamp = new Date().toISOString();
    const priceData = {
      timestamp,
      data: data,
      slug,
      pincode
    };

    // Store in history
    if (!priceHistory.has(slug)) {
      priceHistory.set(slug, []);
    }
    priceHistory.get(slug).push(priceData);

    // Keep only last 100 entries per product
    if (priceHistory.get(slug).length > 100) {
      priceHistory.get(slug).shift();
    }

    res.json(priceData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch price', 
      message: error.message 
    });
  }
});

// API endpoint to get price history
app.get('/api/history/:slug', (req, res) => {
  const { slug } = req.params;
  const history = priceHistory.get(slug) || [];
  res.json(history);
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  let monitorInterval = null;
  let currentSlug = null;

  ws.on('message', async (message) => {
    try {
      const { action, slug, pincode = '110009', interval = 10000 } = JSON.parse(message);

      if (action === 'start') {
        currentSlug = slug;
        
        // Clear existing interval if any
        if (monitorInterval) {
          clearInterval(monitorInterval);
        }

        // Send initial price
        try {
          const data = await fetchProductPrice(slug, pincode);
          
          // Check if product has error (out of stock, not serviceable, etc.)
          if (data.items && data.items[0] && data.items[0].error) {
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: `Product Error: ${data.items[0].error}. Please try a different product or use Demo Mode.`
            }));
            return;
          }
          
          const timestamp = new Date().toISOString();
          const priceData = {
            timestamp,
            data: data,
            slug,
            pincode
          };

          // Store in history
          if (!priceHistory.has(slug)) {
            priceHistory.set(slug, []);
          }
          priceHistory.get(slug).push(priceData);

          ws.send(JSON.stringify({ 
            type: 'price-update', 
            data: priceData 
          }));
        } catch (error) {
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: error.message 
          }));
        }

        // Start monitoring
        monitorInterval = setInterval(async () => {
          try {
            const data = await fetchProductPrice(slug, pincode);
            
            // Check if product has error
            if (data.items && data.items[0] && data.items[0].error) {
              ws.send(JSON.stringify({ 
                type: 'error', 
                message: `Product Error: ${data.items[0].error}`
              }));
              return;
            }
            
            const timestamp = new Date().toISOString();
            const priceData = {
              timestamp,
              data: data,
              slug,
              pincode
            };

            // Store in history
            priceHistory.get(slug).push(priceData);
            if (priceHistory.get(slug).length > 100) {
              priceHistory.get(slug).shift();
            }

            ws.send(JSON.stringify({ 
              type: 'price-update', 
              data: priceData 
            }));
          } catch (error) {
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: error.message 
            }));
          }
        }, interval);

        activeMonitors.set(ws, { slug, pincode, interval: monitorInterval });
      } else if (action === 'stop') {
        if (monitorInterval) {
          clearInterval(monitorInterval);
          monitorInterval = null;
        }
        activeMonitors.delete(ws);
      }
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (monitorInterval) {
      clearInterval(monitorInterval);
    }
    activeMonitors.delete(ws);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

