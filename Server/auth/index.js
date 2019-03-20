//Handles the backend of auth

// require in modules
const express = require('express');
const joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const email = require('../email/index.js');

const dbSelectUser = require('../db/select/selectUser.js');
const dbSelectUserNames = require('../db/select/selectUserNames.js');
const dbInsert = require('../db/insert/insertUser.js');
const dbUpdateUserEmail = require('../db/update/updateUserEmail.js');
const router = express.Router();

// ------  schemas  ------
const signUpSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(), // password must be 8 char long and not empty
  email: joi.string().email({minDomainAtoms: 2 }).required(),
  FirstName: joi.string().alphanum().min(2).max(30).required(),
  LastName: joi.string().alphanum().min(2).max(30).required()
});

const loginSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(),
});

const changeEmailSchema = joi.object().keys({
  email: joi.string().email({minDomainAtoms: 2 }).required(),
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(),
});

const invalidLogin = 'Invalid Login Attempt.';

// ------  routes  ------
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
        bcrypt.hash(req.body.password, 12).then(async hashedPassword => {
          res.json({username});
          await dbInsert(username, hashedPassword, req.body.LastName, req.body.FirstName, req.body.email);
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
    var users = await dbSelectUser(username, function(err, result){
      if(err) next(err);
      try {
        var u = result[0].username;
        bcrypt.compare(req.body.password, result[0].password).then((passwordResult) => {
          if(passwordResult) { //password was correct
            var r = result[0];
            createTokenSendResponse(r, res, next);
          } else {
            invalidLoginAttempt(res, next);
          }
        });
      } catch(e) { // if no matching username then invalid login attempt
          invalidLoginAttempt(res, next);
      }

    });
  } else{
    invalidLoginAttempt(res, next);
  }
});


// handle change email req
router.post('/changeEmail', async(req, res, next) => {
  var changeEmailSubject = "Change of email address";

  const result = joi.validate(req.body, changeEmailSchema);
  if(result.error === null) {
    // first check password matches
    const username = req.body.username;
    var users = await dbSelectUser(username, function(err, result){
      if(err) next(err);
      try {
        var u = result[0].username;
        bcrypt.compare(req.body.password, result[0].password).then(async (passwordResult) => {
          if(passwordResult) { //password was correct
            // update db
            var userID = result[0].UserID;
            var firstname = result[0].FirstName;
            var lastname = result[0].LastName;
            await dbUpdateUserEmail(userID, req.body.email);

            // then send change confirmation email
            var changeEmailText = `Hello ${firstname} ${lastname},
             You have successfully changed your email address to ${req.body.email}`;
            email.sendEmail(req.body.email, changeEmailSubject, changeEmailText, (err, result) => {
              if(err){
                next(err);
              }  else{
                res.json(result);
              }
            });
          } else {
            invalidLoginAttempt(res, next);
          }
        });
      } catch(e) { // if no matching username then invalid login attempt
          invalidLoginAttempt(res, next);
      }
    });
  } else {
    res.json({message: "input error"})
  }
});


// function to set status code and error message for invalid login attempt
function invalidLoginAttempt(res, next) {
  res.status(422); // status code for not processable input
  const error = new Error(invalidLogin);
  next(error); // forwards error to errorHandler
}

// function to make the jwt and send the response to client
function createTokenSendResponse(result, res, next) {
  const payload = {
    UserID: result.UserID,
    username: result.username
  };

  jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1h'
  }, (err, token) => {
    if(err){
      next(err);
    } else {
      res.json({token});
    }
  });
}


module.exports = router;
