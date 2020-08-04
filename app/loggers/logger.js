const winston = require('winston');

let logger = winston.createLogger({
    transports: [new (winston.transports.Console)({
        timestamp: new Date().toISOString(),
        colorize: true,
    })],
});

module.exports = logger;


