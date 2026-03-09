const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: process.env.REMINDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/reminders${path}`
});
