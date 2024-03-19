const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://dev.platformvim.org',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
            }
        })
    );
};
