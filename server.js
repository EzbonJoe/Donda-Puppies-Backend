const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const app = require('./app');
const dns = require('node:dns/promises');

// Try to set custom DNS servers, but fallback silently if it fails
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare + Google DNS
  console.log('Custom DNS servers set ✅');
} catch (err) {
  console.warn('Could not set custom DNS servers, using system defaults ⚠️');
}

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Health check endpoint
app.get('/health', (req, res) => res.status(200).send('OK'));
