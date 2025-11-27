let ws = null;
let chart = null;
let priceData = [];
let isTracking = false;
let demoInterval = null;

// DOM elements
const productSlugInput = document.getElementById('productSlug');
const pincodeInput = document.getElementById('pincode');
const updateIntervalInput = document.getElementById('updateInterval');
const demoModeCheckbox = document.getElementById('demoMode');
const addVariationCheckbox = document.getElementById('addVariation');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');
const currentPriceEl = document.getElementById('currentPrice');
const lastUpdateEl = document.getElementById('lastUpdate');
const dataPointsEl = document.getElementById('dataPoints');
const productInfoEl = document.getElementById('productInfo');
const productDetailsEl = document.getElementById('productDetails');
const priceStatsEl = document.getElementById('priceStats');

// Initialize Chart
function initChart() {
  const ctx = document.getElementById('priceChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Effective Price (₹)',
        data: [],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }, {
        label: 'Marked Price (₹)',
        data: [],
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#dc3545',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderDash: [5, 5]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += '₹' + context.parsed.y.toFixed(2);
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price (₹)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            callback: function(value) {
              return '₹' + value.toFixed(2);
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
}

// Update chart with new data
function updateChart(timestamp, priceInfo) {
  console.log('Updating chart with:', { timestamp, priceInfo });
  
  if (!chart) {
    console.error('Chart not initialized!');
    return;
  }
  
  const time = new Date(timestamp).toLocaleTimeString();
  
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(priceInfo.effective);
  chart.data.datasets[1].data.push(priceInfo.marked);

  console.log('Chart data after push:', {
    labels: chart.data.labels.length,
    effective: chart.data.datasets[0].data.length,
    marked: chart.data.datasets[1].data.length
  });

  // Keep only last 50 data points for better visibility
  if (chart.data.labels.length > 50) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
  }

  chart.update(); // Update chart
  console.log('Chart updated successfully');
}

// Extract price information from API response
function extractPriceInfo(data) {
  try {
    console.log('Extracting price info from:', data);
    
    if (data && data.data && data.data.items && data.data.items.length > 0) {
      const item = data.data.items[0];
      console.log('Item from response:', item);
      
      // Check for error in response
      if (item.error) {
        console.error('API Error:', item.error);
        showError(`API Error: ${item.error}`);
        return null;
      }
      
      const priceInfo = item.price || {};
      console.log('Price info:', priceInfo);
      
      // Check if we have valid price data
      if (priceInfo.effective === undefined && priceInfo.marked === undefined) {
        console.error('No price data in response:', item);
        showError('No price data available for this product');
        return null;
      }
      
      let effective = priceInfo.effective || 0;
      let marked = priceInfo.marked || 0;
      
      console.log('Extracted prices - Effective:', effective, 'Marked:', marked);
      
      // Add variation if checkbox is checked (for visualization)
      if (addVariationCheckbox && addVariationCheckbox.checked && !demoModeCheckbox.checked) {
        const variation = (Math.random() - 0.5) * 0.04; // ±2% variation
        effective = effective * (1 + variation);
        marked = marked * (1 + variation);
        console.log('After variation - Effective:', effective, 'Marked:', marked);
      }
      
      const result = {
        effective: effective,
        marked: marked,
        selling: priceInfo.selling || 0,
        currency: priceInfo.currency_symbol || '₹',
        discount: item.discount || 'No discount',
        productName: item.product_name || item.name || 'Unknown Product',
        brand: item.brand?.name || 'Tira',
        available: item.is_serviceable !== false,
        quantity: item.quantity || 0,
        store: item.store?.name || 'Unknown Store'
      };
      
      console.log('Final extracted price info:', result);
      return result;
    }
    
    console.warn('Data structure not as expected:', data);
  } catch (error) {
    console.error('Error extracting price info:', error);
    showError(`Error parsing response: ${error.message}`);
  }
  return null;
}

// Show error message to user
function showError(message) {
  statusEl.textContent = 'Error';
  statusEl.className = 'value inactive';
  
  // Create error notification
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-notification';
  errorDiv.innerHTML = `
    <strong>⚠️ Error:</strong> ${message}
    <button onclick="this.parentElement.remove()">×</button>
  `;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc3545;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 1000;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(errorDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Update product information display
function updateProductInfo(priceInfo) {
  if (!priceInfo) return;

  productDetailsEl.innerHTML = `
    <div class="product-detail-item">
      <strong>Product:</strong> ${priceInfo.productName}
    </div>
    <div class="product-detail-item">
      <strong>Brand:</strong> ${priceInfo.brand}
    </div>
    <div class="product-detail-item">
      <strong>Available:</strong> ${priceInfo.available ? '✅ Yes' : '❌ No'}
    </div>
    ${priceInfo.discount && priceInfo.discount !== 'No discount' ? `
    <div class="product-detail-item">
      <strong>Discount:</strong> ${priceInfo.discount}
    </div>
    ` : ''}
    ${priceInfo.quantity > 0 ? `
    <div class="product-detail-item">
      <strong>Stock:</strong> ${priceInfo.quantity} units
    </div>
    ` : ''}
    ${priceInfo.store ? `
    <div class="product-detail-item">
      <strong>Store:</strong> ${priceInfo.store}
    </div>
    ` : ''}
  `;
  
  productInfoEl.style.display = 'block';
}

// Update statistics
function updateStats() {
  if (priceData.length === 0) {
    priceStatsEl.style.display = 'none';
    return;
  }

  const prices = priceData.map(d => d.price.effective);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priceChange = prices.length > 1 ? prices[prices.length - 1] - prices[0] : 0;
  const priceChangePercent = prices.length > 1 ? ((priceChange / prices[0]) * 100) : 0;

  document.getElementById('minPrice').textContent = `₹${minPrice.toFixed(2)}`;
  document.getElementById('maxPrice').textContent = `₹${maxPrice.toFixed(2)}`;
  document.getElementById('avgPrice').textContent = `₹${avgPrice.toFixed(2)}`;
  
  const changeEl = document.getElementById('priceChange');
  const changeSign = priceChange >= 0 ? '+' : '';
  changeEl.textContent = `${changeSign}₹${priceChange.toFixed(2)} (${changeSign}${priceChangePercent.toFixed(2)}%)`;
  changeEl.style.color = priceChange >= 0 ? '#28a745' : '#dc3545';

  priceStatsEl.style.display = 'grid';
}

// Connect WebSocket
function connectWebSocket() {
  // Use CONFIG if available, otherwise fallback to local
  const wsUrl = typeof CONFIG !== 'undefined' 
    ? CONFIG.getWebSocketUrl() 
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
  
  console.log('Connecting to WebSocket:', wsUrl);
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('WebSocket message received:', message);

    if (message.type === 'price-update') {
      // message.data contains {timestamp, data: {items: [...]}, slug}
      const { timestamp, data, slug } = message.data;
      console.log('Price update - timestamp:', timestamp, 'data:', data, 'slug:', slug);
      
      // Wrap data in the expected format for extractPriceInfo
      const wrappedData = { data: data };
      console.log('Wrapped data for extraction:', wrappedData);
      
      const priceInfo = extractPriceInfo(wrappedData);

      if (priceInfo) {
        priceData.push({
          timestamp,
          price: priceInfo
        });

        updateChart(timestamp, priceInfo);
        updateProductInfo(priceInfo);

        currentPriceEl.textContent = `₹${priceInfo.effective.toFixed(2)}`;
        lastUpdateEl.textContent = new Date(timestamp).toLocaleTimeString();
        dataPointsEl.textContent = priceData.length;

        updateStats();
      } else {
        console.warn('No valid price info extracted from response');
      }
    } else if (message.type === 'error') {
      console.error('WebSocket error:', message.message);
      showError(message.message);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    statusEl.textContent = 'Connection Error';
    statusEl.className = 'value inactive';
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    if (isTracking) {
      statusEl.textContent = 'Disconnected';
      statusEl.className = 'value inactive';
      stopTracking();
    }
  };
}

// Generate demo data
function generateDemoData() {
  const basePrice = 450 + Math.random() * 50; // Base price between 450-500
  const markedPrice = basePrice * 1.2; // 20% markup
  const variation = (Math.random() - 0.5) * 20; // Random variation ±10
  
  return {
    data: {
      items: [{
        price: {
          effective: basePrice + variation,
          marked: markedPrice
        },
        name: 'Demo Product - Lakme Lipstick',
        brand: { name: 'Lakme' },
        is_available: true,
        discount: '15% OFF'
      }]
    }
  };
}

// Start demo mode
function startDemoMode() {
  const interval = parseInt(updateIntervalInput.value) * 1000;
  isTracking = true;
  priceData = [];

  statusEl.textContent = 'Demo Mode Active';
  statusEl.className = 'value active';
  startBtn.disabled = true;
  stopBtn.disabled = false;
  productSlugInput.disabled = true;
  pincodeInput.disabled = true;
  updateIntervalInput.disabled = true;
  demoModeCheckbox.disabled = true;
  if (addVariationCheckbox) addVariationCheckbox.disabled = true;

  // Generate initial data
  const initialData = generateDemoData();
  const timestamp = new Date().toISOString();
  const priceInfo = extractPriceInfo(initialData);
  
  if (priceInfo) {
    priceData.push({ timestamp, price: priceInfo });
    updateChart(timestamp, priceInfo);
    updateProductInfo(priceInfo);
    currentPriceEl.textContent = `₹${priceInfo.effective.toFixed(2)}`;
    lastUpdateEl.textContent = new Date(timestamp).toLocaleTimeString();
    dataPointsEl.textContent = priceData.length;
    updateStats();
  }

  // Continue generating data
  demoInterval = setInterval(() => {
    const data = generateDemoData();
    const timestamp = new Date().toISOString();
    const priceInfo = extractPriceInfo(data);
    
    if (priceInfo) {
      priceData.push({ timestamp, price: priceInfo });
      updateChart(timestamp, priceInfo);
      updateProductInfo(priceInfo);
      currentPriceEl.textContent = `₹${priceInfo.effective.toFixed(2)}`;
      lastUpdateEl.textContent = new Date(timestamp).toLocaleTimeString();
      dataPointsEl.textContent = priceData.length;
      updateStats();
    }
  }, interval);
}

// Start tracking
function startTracking() {
  const slug = productSlugInput.value.trim();
  const pincode = pincodeInput.value.trim();
  const interval = parseInt(updateIntervalInput.value) * 1000;

  // Check if demo mode is enabled
  if (demoModeCheckbox.checked) {
    startDemoMode();
    return;
  }

  if (!slug) {
    alert('Please enter a product slug');
    return;
  }

  // Validate pincode
  if (!pincode || !/^\d{6}$/.test(pincode)) {
    alert('Please enter a valid 6-digit pincode');
    return;
  }

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    connectWebSocket();
    // Wait for connection to open
    setTimeout(() => {
      startTracking();
    }, 500);
    return;
  }

  isTracking = true;
  priceData = [];

  ws.send(JSON.stringify({
    action: 'start',
    slug: slug,
    pincode: pincode,
    interval: interval
  }));

  statusEl.textContent = 'Tracking Active';
  statusEl.className = 'value active';
  startBtn.disabled = true;
  stopBtn.disabled = false;
  productSlugInput.disabled = true;
  pincodeInput.disabled = true;
  updateIntervalInput.disabled = true;
  demoModeCheckbox.disabled = true;
}

// Stop tracking
function stopTracking() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ action: 'stop' }));
  }

  isTracking = false;
  statusEl.textContent = 'Stopped';
  statusEl.className = 'value inactive';
  startBtn.disabled = false;
  stopBtn.disabled = true;
  productSlugInput.disabled = false;
  pincodeInput.disabled = false;
  updateIntervalInput.disabled = false;
  demoModeCheckbox.disabled = false;
  if (addVariationCheckbox) addVariationCheckbox.disabled = false;
}

// Clear history
function clearHistory() {
  priceData = [];
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.update();

  currentPriceEl.textContent = '-';
  lastUpdateEl.textContent = '-';
  dataPointsEl.textContent = '0';
  productInfoEl.style.display = 'none';
  priceStatsEl.style.display = 'none';
}

// Event listeners
startBtn.addEventListener('click', startTracking);
stopBtn.addEventListener('click', stopTracking);
clearBtn.addEventListener('click', clearHistory);

// Initialize
console.log('Initializing application...');
initChart();
console.log('Chart initialized');
connectWebSocket();
console.log('WebSocket connection initiated');

