const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', {
      target: 'http://111.231.64.75:8080/',
      "changeOrigin": true,
      "pathRewrite": {
        "^/api/": "/api/"
      } 
    })
  );
  app.use(proxy('/listener', {
    target: 'http://111.231.64.75:8083/',
    "changeOrigin": true,
    "pathRewrite": {
      "^/listener/": "/listener/"
    } 
  })
);
};