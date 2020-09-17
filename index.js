const express = require("express");
const cors = require("cors");
const config = require("./app/config")
const bodyParser = require("body-parser");
require('dotenv').config()  //Enable access to the ".env" file
//** mongodb ORM and Database  */
const mongoose = require('mongoose');
/**-----------------Loggers------------ */
const logger = require("./app/loggers/logger")
const requestLogger = require("./app/loggers/requestLogger")
const expressRequestId = require('express-request-id')();
var winston = require('winston');
require('winston-timer')(winston);
/**-------------Security and Authentication------ */
//const session = require('express-session')
const helmet = require("helmet");
const passport = require('passport');
require('./app/config/passport');
//--------------------------------------

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.y1mqq.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
// Pass the global passport object into the configuration function


// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressRequestId);

app.use(cors({
  origin: config.corsDomain,
}));

app.use(helmet());

//app.use(session({ secret: 'sessionsecret' }));
app.use(passport.initialize())
app.use(passport.session());

//app.use(helmet()); //security

app.use(requestLogger);

//Database Connection
var db = mongoose.connection;
if (!db)
  console.log("Error connecting db")
else
  console.log("Db connected successfully")


// simple route
app.get("/", (req, res) => {
  res.send("Hello World.");
});

//Routes
require("./app/routes/Project.routes")(app);
require("./app/routes/User.routes")(app);
require("./app/routes/Label.routes")(app);
require("./app/routes/Status.routes")(app);
require("./app/routes/Comment.routes")(app);
require("./app/routes/Issue.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT).on("listening", () => {
  logger.info(`Server is running on port ${PORT}.`);
});


module.exports = app
