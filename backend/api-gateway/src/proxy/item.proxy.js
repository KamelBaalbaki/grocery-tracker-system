const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: process.env.ITEM_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/items${path}`
});
