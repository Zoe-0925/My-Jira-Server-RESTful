const express = require("express");
const cors = require("cors");
const config = require("./app/config")
const helmet = require("helmet");
//** mongodb ORM and Database  */
const mongoose = require('mongoose');
/**-----------------Loggers------------ */
const logger = require("./app/loggers/logger")
const requestLogger = require("./app/loggers/requestLogger")
const expressRequestId = require('express-request-id')();
var winston = require('winston');
require('winston-timer')(winston);
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

app.use(expressRequestId);

app.use(cors({
  origin: config.corsDomain,
}));

app.use(helmet()); //security

app.use(requestLogger);

//Add 404 not found 
app.use((err, req, res, next) => {
  return res.status(404).json({ error: err })
});

//Database Connection
mongoose.Promise = global.Promise;
var db = mongoose.connection;
if (!db)
  console.log("Error connecting db")
else
  console.log("Db connected successfully")

//Routes
//TODO login route
require("./app/routes/Project.routes")(app);
require("./app/routes/User.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT).on("listening", () => {
  logger.info(`Server is running on port ${PORT}.`);
});




