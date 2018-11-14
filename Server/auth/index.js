//Handles the backend of auth

// require in modules
const express = require('express');
const joi = require('joi');
const bcrypt = require('bcryptjs');

const dbSelectPassword = require('../db/selectPassword.js');
const dbSelectUserNames = require('../db/selectUserNames.js');
const dbInsert = require('../db/insert.js');

const router = express.Router();
const signUpSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(),
  email: joi.string().email({minDomainAtoms: 2 }).required(),
  FirstName: joi.string().alphanum().min(2).max(30).required(),
  LastName: joi.string().alphanum().min(2).max(30).required() // password must be 8 char long and not empty
});

const loginSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(),
});

const invalidLogin = 'Invalid Login Attempt.';
// any route in here is pre-prended with /auth

router.get('/', (req, res) => {
  res.json({
    message: 'router works'
  });
});

// handle signup request
router.post('/signup', async (req, res, next) => {
  //console.log('body', req.body );
  var username = req.body.username;
  const result = joi.validate(req.body, signUpSchema);
  if(result.error === null) {
    var users = await dbSelectUserNames(username, function(err, result){
      if(err) next(err);
      // try to get the username from the sql query result, if it throws an error the username is free
      try {
        result[0].username;
        var error = new Error("That username is taken, please choose another.");
        res.status(409); // status code for conflicts e.g. duplicate username
        next(error);
      } catch(e) {// if username is free, then hash the passsword
        bcrypt.hash(req.body.password, 12).then(hashedPassword => {
          res.json({username});
          dbInsert(username, hashedPassword, req.body.email, req.body.FirstName, req.body.LastName);
        });
      }
    });
  } else{
    res.status(422); // status code for not processable input
    next(result.error); // forwards error to errorHandler
  }
});


// handle login request
router.post('/login', async(req, res, next) => {
  const result = joi.validate(req.body, loginSchema);
  if(result.error === null) {
    const username = req.body.username;
    var users = await dbSelectPassword(username, function(err, result){
      if(err) next(err);
      try {
        var p = result[0].password;
      } catch(e) { // if no matching username then invalid login attempt
          invalidLoginAttempt(res, next);
      }
      bcrypt.compare(req.body.password, result[0].password).then((passwordResult) => {
        res.json({passwordResult});
      });
    });
  } else{
    invalidLoginAttempt(res, next);
  }
});


// function to set status code and error message for invalid login attempt
function invalidLoginAttempt(res, next) {
  res.status(422); // status code for not processable input
  const error = new Error(invalidLogin);
  next(error); // forwards error to errorHandler
}

module.exports = router;
