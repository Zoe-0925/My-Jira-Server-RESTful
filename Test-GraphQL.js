const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

import { graphqlExpress } from 'apollo-server-express';

const myGraphQLSchema = // ... define or import your schema here!


// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }));

  // passing options
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
      schema: myGraphQLSchema,
      // other options here
    }),
  );

