const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: process.env.RECIPE_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/recipes${path}`
});
