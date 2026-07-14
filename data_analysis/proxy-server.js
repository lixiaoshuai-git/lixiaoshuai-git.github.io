// CORS 代理服务器
// 用法: node proxy-server.js
// 然后用浏览器打开 http://localhost:3000/index.html
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const TARGET_API = 'http://192.168.1.16:8080';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // 处理 API 代理请求: /api/xxx -> http://192.168.1.16:8080/xxx
  if (parsedUrl.pathname.startsWith('/api/')) {
    const apiUrl = TARGET_API + parsedUrl.pathname.replace('/api', '') + (parsedUrl.search || '');

    const options = {
      hostname: '192.168.1.16',
      port: 8080,
      path: parsedUrl.pathname.replace('/api', '') + (parsedUrl.search || ''),
      method: req.method,
      headers: { ...req.headers, host: '192.168.1.16:8080' }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      // 加上 CORS 头
      res.writeHead(proxyRes.statusCode, {
        ...proxyRes.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (e) => {
      console.error('代理请求失败:', e.message);
      res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: '代理请求失败', message: e.message }));
    });

    req.pipe(proxyReq);
    return;
  }

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // 提供静态文件
  let filePath = parsedUrl.pathname;
  if (filePath === '/') filePath = '/index.html';

  // 尝试从原始 index.html 所在目录读取
  const htmlDir = path.dirname('C:/Users/蔡华升/Documents/WeChat Files/wxid_b43h8ie92gj422/FileStorage/File/2026-07/index.html');
  const fullPath = path.join(htmlDir, path.basename(filePath));

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('文件未找到: ' + filePath);
      return;
    }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`代理服务器已启动: http://localhost:${PORT}`);
  console.log(`API 代理目标: ${TARGET_API}`);
  console.log(`请用浏览器打开: http://localhost:${PORT}/index.html`);
});
