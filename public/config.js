// Configuration for different environments
const CONFIG = {
  // Backend WebSocket URL
  // For local development: uses current host
  // For production: set this to your deployed backend URL
  getWebSocketUrl: function() {
    // Check if we're on GitHub Pages or other static hosting
    const hostname = window.location.hostname;
    
    // If running on GitHub Pages, use the backend URL from environment or default
    if (hostname.includes('github.io')) {
      // TODO: Replace with your deployed backend URL
      // Example: 'wss://your-backend.herokuapp.com'
      // Example: 'wss://your-backend.railway.app'
      // Example: 'wss://your-backend.onrender.com'
      const backendUrl = window.BACKEND_URL || 'ws://localhost:3001';
      console.warn('Running on GitHub Pages. Backend URL:', backendUrl);
      console.warn('Please update config.js with your deployed backend URL');
      return backendUrl;
    }
    
    // For local development, use the current host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  },
  
  // API endpoint base URL
  getApiUrl: function() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.io')) {
      const backendUrl = window.BACKEND_URL || 'http://localhost:3001';
      return backendUrl;
    }
    
    return window.location.origin;
  }
};

// Allow overriding backend URL via window object
// Usage: Add this to your HTML before loading app.js:
// <script>window.BACKEND_URL = 'wss://your-backend.herokuapp.com';</script>

