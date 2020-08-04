const express = require("express");
const cors = require("cors");
const config = require("./app/config")
//** mongodb ORM and Database  */
const mongoose = require('mongoose');
/**-----------------Loggers------------ */
const logger = require("./app/loggers/logger")
const requestLogger = require("./app/loggers/requestLogger")
const expressRequestId = require('express-request-id')();
var winston = require('winston');
require('winston-timer')(winston);
/**Run GraphQL Express */
const apollo = require('./app/graphql');
const schema = require('./app/graphql/Schema.js');
const bodyParser = require("body-parser");
//--------------------------------------

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:<${process.env.PASSWORD}>@cluster0-8vkls.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//require("./app/routes/Project.routes")(app);

app.use(expressRequestId);

app.use(cors({
  origin: config.corsDomain,
}));

schema.applyMiddleware({ app })

app.use(requestLogger);

//Add 404 not found 
app.use((req, res) => {
  return res.status(404).render("404", {
    title: "404"
  });
});

//Prevent displaying the error trace to the user
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  console.error(error)
  return res.status(500).render("500", {
    title: "500"
  });
});



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT).on("listening", () => {
  logger.info(`Server is running on port ${PORT}.`);
});

// Endpoint to check if the API is running
app.get('/api/status', (req, res) => {
  res.send({ status: 'ok' });
});

// Append apollo to our API
apollo(app);


//Syntax for winston timer:
//winston.start_log('long-running-task', 'info'); 
/* ... */
//winston.stop_log('long-running-task', 'warn');




