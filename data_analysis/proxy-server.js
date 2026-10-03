// CORS 代理服务器（本地开发用）
// 用法: node proxy-server.js
// 环境变量（可选）:
//   TARGET_API=http://127.0.0.1:8080   后端接口地址
//   PORT=3000                          本地监听端口
// 然后用浏览器打开 http://localhost:3000/index.html
//
// 说明：后端地址通过环境变量传入，不要把它和本机路径写死在源码里——
// 这是一个公开仓库，写死的内网 IP 和本地目录会直接暴露给所有人。
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = Number(process.env.PORT || 3000);
const TARGET_API = process.env.TARGET_API || 'http://127.0.0.1:8080';
const target = new URL(TARGET_API);
const client = target.protocol === 'https:' ? https : http;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // 处理 API 代理请求: /api/xxx -> {TARGET_API}/xxx
  if (parsedUrl.pathname.startsWith('/api/')) {
    const options = {
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname.replace('/api', '') + (parsedUrl.search || ''),
      method: req.method,
      headers: { ...req.headers, host: target.host }
    };

    const proxyReq = client.request(options, (proxyRes) => {
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

  // 提供静态文件：从本脚本所在目录读取（即 data_analysis/）
  let filePath = parsedUrl.pathname;
  if (filePath === '/') filePath = '/index.html';
  const fullPath = path.join(__dirname, path.basename(filePath));

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('文件未找到: ' + filePath);
      return;
    }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`代理服务器已启动: http://localhost:${PORT}`);
  console.log(`API 代理目标: ${TARGET_API}（可用环境变量 TARGET_API 修改）`);
  console.log(`请用浏览器打开: http://localhost:${PORT}/index.html`);
});
