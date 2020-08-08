module.exports = {
    env: process.env.NODE_ENV || 'development',
    port:  8080,
    corsDomain: process.env.CORS_DOMAIN || "http://localhost:3000"
  };
  