#!/usr/bin/env node

const axios = require('axios');
const https = require('https');

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

async function testProduct(slug) {
  try {
    console.log(`\n🔍 Testing product: ${slug}\n`);
    
    const response = await axiosInstance.post(
      'https://www.tiraz5.de/api/service/application/catalog/v1.0/products/sizes/price',
      {
        items: [{
          slug: slug,
          size: 'OS'
        }]
      },
      {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Bearer NjJjNDUwM2IwYjJlOTcxMWQ5OWI4NWFhOmtXRDFWeks4Yg==',
          'content-type': 'application/json',
          'origin': 'https://www.tiraz5.de',
          'x-currency-code': 'INR',
          'x-location-detail': '{"country":"INDIA","city":"DELHI","pincode":"110009"}',
          'Cookie': 'anonymous_id=854a2577d24b49d1a6743d504c36cf68; old_browser_anonymous_id=854a2577d24b49d1a6743d504c36cf68'
        }
      }
    );
    
    const item = response.data.items[0];
    
    if (item.error) {
      console.log(`❌ Error: ${item.error}`);
      console.log(`\n💡 This product cannot be tracked. Try a different one.\n`);
      return false;
    }
    
    console.log(`✅ Product is available!`);
    console.log(`📦 Name: ${item.product_name}`);
    console.log(`💰 Price: ₹${item.price.effective}`);
    console.log(`🏪 Store: ${item.store?.name || 'Unknown'}`);
    console.log(`📊 Stock: ${item.quantity} units`);
    console.log(`\n✨ This product can be tracked!\n`);
    return true;
    
  } catch (error) {
    console.log(`❌ API Error: ${error.message}\n`);
    return false;
  }
}

// Get slug from command line or use default
const slug = process.argv[2] || 'lakme-enrich-matte-lipstick---shade-wm10-47g-t1899xdfjvvt';

testProduct(slug);



