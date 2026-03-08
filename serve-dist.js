import http from 'http';
import fs from 'fs';
import path from 'path';

const port = 5000;
const distDir = path.resolve('./dist');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url;
  if (reqPath === '/') {
    reqPath = '/index.html';
  }
  const filePath = path.join(distDir, reqPath);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // try fallback to index.html for SPA
      const indexPath = path.join(distDir, 'index.html');
      fs.readFile(indexPath, (e, data) => {
        if (e) {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        }
      });
      return;
    }
    const ext = path.extname(filePath);
    const contentType = mime[ext] || 'application/octet-stream';
    fs.readFile(filePath, (e, data) => {
      if (e) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Serving dist folder at http://localhost:${port}`);
});
