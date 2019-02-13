//handles overall routing/processing of requiest for the app
// the middlewares are used in the order theyre in

// require in modules
const express = require('express');
const https = require('https');
const fs = require('fs');
const rateLimiter = require('express-rate-limit');

const volleyball = require('volleyball'); // shows req/res in node terminal
const cors = require('cors');
const middlewares = require('./auth/middlewares');
require('dotenv').config();

const port = process.env.PORT || 3000;
var app = express();
var options = {
  key: fs.readFileSync('server/certificate/hostkey.pem').toString(),
  cert: fs.readFileSync('server/certificate/hostcert.pem').toString()
};

// important if behind a proxy to ensure client IP is passed to req.ip
app.enable('trust proxy');

const auth = require('./auth/index.js');
const league = require('./league/index.js');
const team = require('./team/index.js');

// don't allow more than 10 reqs in 15 mins
var apiAuthLimiter = new rateLimiter({
  windowMs: 15*60*1000, // 15 mins
  max: 2,
  message: 'Too many login attempts, please try again later.',
});

// shows req/res nicely in terminal
app.use(volleyball);

// only allow client request from this origin
app.use(cors({
  origin: 'http://localhost:8080'
}));

app.use(express.json());

// check the users jwt
app.use(middlewares.checkTokenSetUser);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
    user: req.user,
  });
});

app.use('/auth/login', apiAuthLimiter);   // rate limit the login route
app.use('/auth', auth);
app.use('/league', middlewares.isLoggedIn, league); //check a user is logged in to access this route
app.use('/team', middlewares.isLoggedIn, team);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found- ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}
// order of middlewares matters, so error handlers go last
app.use(notFound);
app.use(errorHandler);

https.createServer(options, app).listen(port, () => {
  console.log(`Listening on ${port}`);
})
