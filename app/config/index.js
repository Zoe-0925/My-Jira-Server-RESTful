module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10)  || 8080,
    corsDomain: process.env.CORS_DOMAIN || "http://localhost:3000"
  };
  