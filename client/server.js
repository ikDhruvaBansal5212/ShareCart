const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    let filePath;
    let parsedUrl = req.url.split('?')[0]; // Remove query string
    
    // Handle root
    if (parsedUrl === '/') {
        filePath = path.join(__dirname, 'index.html');
    }
    // Handle direct page requests without /pages/ prefix
    else if (['/login.html', '/register.html', '/dashboard.html', '/shop.html', 
              '/profile.html', '/orders.html', '/my-carts.html', '/browse-carts.html',
              '/shared-carts.html', '/cart-details.html', '/join-cart.html'].includes(parsedUrl)) {
        filePath = path.join(__dirname, 'pages', parsedUrl);
    }
    // Handle everything else
    else {
        filePath = path.join(__dirname, parsedUrl);
    }
    
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'text/plain';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Try adding .html extension if not present
                if (!extname && !filePath.endsWith('.html')) {
                    const htmlPath = filePath + '.html';
                    fs.readFile(htmlPath, (err2, content2) => {
                        if (err2) {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(`<h1>404 - File Not Found</h1><p>Path: ${parsedUrl}</p>`, 'utf-8');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(content2, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(`<h1>404 - File Not Found</h1><p>Path: ${parsedUrl}</p>`, 'utf-8');
                }
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`✅ Frontend server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
});
