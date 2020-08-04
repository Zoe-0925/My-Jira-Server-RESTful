const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const config = require('../config');
const schema = require('./schema');

module.exports = (app) => {
  if (config.env === 'development') {
    schema.applyMiddleware({ app })
  }
};