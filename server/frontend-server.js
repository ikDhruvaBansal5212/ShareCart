const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║       ShareCart Frontend Server           ║
║                                           ║
║  Server running on port: ${PORT}             ║
║  Open: http://localhost:${PORT}              ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});
