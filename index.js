const express = require("express");
const cors = require("cors");
const config = require("./app/config")
const bodyParser = require("body-parser");
//** mongodb ORM and Database  */
const mongoose = require('mongoose');
/**-----------------Loggers------------ */
const logger = require("./app/loggers/logger")
const requestLogger = require("./app/loggers/requestLogger")
const expressRequestId = require('express-request-id')();
var winston = require('winston');
require('winston-timer')(winston);
/**-------------Security and Authentication------ */
const helmet = require("helmet");
//--------------------------------------

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:<${process.env.PASSWORD}>@cluster0-8vkls.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require("./app/PassportAuthentication")(app);

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
require("./app/routes/Project.routes")(app);
require("./app/routes/User.routes")(app);
require("./app/routes/Label.routes")(app);
require("./app/routes/Status.routes")(app);
require("./app/routes/Comment.routes")(app);
require("./app/routes/Issue.routes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

if (process.env.NODE_ENV === "production") {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/learnpassportjs.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/learnpassportjs.com/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/learnpassportjs.com/chain.pem', 'utf8');
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  https.createServer(credentials, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
  http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80);
} else if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT).on("listening", () => {
    logger.info(`Server is running on port ${PORT}.`);
  });
}

