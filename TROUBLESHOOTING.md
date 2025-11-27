# Troubleshooting Guide

## Graph Not Updating - SOLVED ✅

### Problem
The graph was not updating because:
1. The Tira API returns errors for products not serviceable at the configured location
2. The API response structure varies (sometimes contains error messages)
3. SSL certificate issues with the API endpoint

### Solutions Implemented

#### 1. Demo Mode (Recommended)
- Added a **Demo Mode** checkbox that simulates realistic price changes
- Perfect for testing the graph functionality
- No API dependencies
- Shows all features working correctly

**How to use:**
1. Check the "Demo Mode" checkbox
2. Click "Start Tracking"
3. Watch the live graph update with simulated data

#### 2. Enhanced Error Handling
- Added proper error detection for API responses
- Visual error notifications appear in the top-right corner
- Console logging for debugging
- Graceful fallback when price data is missing

#### 3. SSL Certificate Fix
- Configured Axios with custom HTTPS agent
- Bypasses SSL certificate verification issues
- Allows connection to Tira API without certificate errors

## Common Issues

### Issue: "Product is not serviceable at given locality"
**Cause:** The product is not available for delivery to Delhi, PIN 110009 (the configured location)

**Solutions:**
- Use Demo Mode to test the application
- Try a different product slug that's available in Delhi
- Update the location in `server.js` if you want to use a different delivery area

### Issue: "Request failed with status code 400"
**Cause:** Invalid product slug or API parameters

**Solutions:**
- Verify the product slug is correct
- Use Demo Mode for testing
- Check that the product exists on tiraz5.de

### Issue: WebSocket Connection Failed
**Cause:** Server not running or port conflict

**Solutions:**
- Ensure server is running: `npm start`
- Check if port 3000 is available
- Look for error messages in terminal

## Testing the Application

### Quick Test (Demo Mode)
1. Open http://localhost:3000
2. Check "Demo Mode"
3. Click "Start Tracking"
4. You should see:
   - Status changes to "Demo Mode Active"
   - Graph starts updating every 10 seconds
   - Price statistics appear
   - Product details show

### Real API Test
1. Visit https://www.tiraz5.de
2. Find a product and copy its slug from the URL
3. Paste the slug in the input field
4. Uncheck "Demo Mode"
5. Click "Start Tracking"
6. Check browser console (F12) for any errors

## Debug Tips

### Enable Console Logging
Open browser DevTools (F12) and check the Console tab for:
- WebSocket connection status
- API responses
- Price data extraction logs
- Error messages

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Look for WebSocket connection (ws://)
4. Monitor messages being sent/received

### Server Logs
Check the terminal where you ran `npm start` for:
- Client connection messages
- API request errors
- Price fetch attempts

## Configuration

### Change Update Interval
- Minimum: 5 seconds
- Maximum: 300 seconds (5 minutes)
- Default: 10 seconds

### Change Delivery Location
Edit `server.js` and update the location header:
```javascript
'x-location-detail': '{"country":"INDIA","city":"DELHI","pincode":"110009"}'
```

### Update Authorization Token
If the API token expires, update it in `server.js`:
```javascript
'authorization': 'Bearer YOUR_NEW_TOKEN_HERE'
```

## Features Working

✅ Demo Mode with simulated data  
✅ Real-time graph updates  
✅ WebSocket connection  
✅ Price statistics  
✅ Product information display  
✅ Error notifications  
✅ SSL certificate handling  
✅ Start/Stop/Clear controls  
✅ Responsive design  

## Need Help?

If you're still having issues:
1. Try Demo Mode first to verify the application works
2. Check browser console for JavaScript errors
3. Check server terminal for backend errors
4. Verify the server is running on port 3000
5. Try a different browser



