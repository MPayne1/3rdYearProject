//Handles the backend of auth

// require in modules
const express = require('express');
const joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const email = require('../email/index.js');
const crypto = require('crypto');

const dbSelectUser = require('../db/select/selectUser.js');
const dbSelectUserNames = require('../db/select/selectUserNames.js');
const dbInsert = require('../db/insert/insertUser.js');
const dbUpdateUserEmail = require('../db/update/updateUserEmail.js');
const dbUpdateUserPassword = require('../db/update/updateUserPassword.js');
const dbSelectUserForgottenPassword = require('../db/select/selectUserForgottenPassword.js');
const dbSelectResetPasswordInfo = require('../db/select/selectResetPasswordInfo.js');
const dbUpdateResetPasswordInfo = require('../db/update/updateUserForgottenPassword.js');
const dbInsertPasswordReset = require('../db/insert/insertPasswordReset.js');


const router = express.Router();
const hashingRounds = 12;

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

const changePasswordSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(),
  newPassword: joi.string().trim().min(8).required(),
});

const resetPasswordSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().trim().min(8).required(),
  resetToken: joi.required(),
})

const forgottonPasswordSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  email: joi.string().email({minDomainAtoms: 2 }).required(),
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
        bcrypt.hash(req.body.password, hashingRounds).then(async hashedPassword => {
          res.json({username});
          await dbInsert(username, hashedPassword, req.body.LastName, req.body.FirstName, req.body.email);
          await dbInsertPasswordReset(username);
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
            email.sendChangeEmail(req.body.email, firstname, lastname, (err, result) => {
              if(err){
                next(err);
              }  else{
              res.json({message: "Email updated"})
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

// handle change password req
router.post('/changePassword', async(req, res, next) => {

  const result = joi.validate(req.body, changePasswordSchema);
  if(result.error === null) {

    // check current password
    const username = req.body.username;
    var users = await dbSelectUser(username, function(err, result){
      if(err) next(err);
      try {
        var u = result[0].username;
        bcrypt.compare(req.body.password, result[0].password).then(async (passwordResult) => {
          if(passwordResult) { //password was correct
            // generate new hashedPassword
            bcrypt.hash(req.body.newPassword, hashingRounds).then(async hashedPassword => {
              // update db
              await dbUpdateUserPassword(result[0].UserID, hashedPassword);
            });

            var firstname = result[0].FirstName;
            var lastname = result[0].LastName;
              // send email for change of password
            email.sendChangePassword(result[0].Email, firstname, lastname, (err, result) => {
              if(err){
                next(err);
              } else {
                res.json({message: 'password changed'});
              }
            });
          } else {
            invalidLoginAttempt(res, next);
          }
        });
      } catch(e) { // if no matching username then invalid change password attempt
          invalidLoginAttempt(res, next);
      }
    });
  } else {
    res.json({message: "input error"})
  }

})


// forgotten password req
router.post('/forgottenPassword', async(req, res, next) => {
  const result = joi.validate(req.body, forgottonPasswordSchema);
  if(result.error === null) {
    var username = req.body.username;
    var userEmail = req.body.email;
    // check db for username and email.
    await dbSelectUserForgottenPassword(username, userEmail, async (err, result) => {
      if(err) next(err);
      try{
        var userID = result[0].UserID;
        var token;
        const buf = crypto.randomBytes(20);
        token = buf.toString('hex');

        var expires = Date.now() + 3600000; //expires in 1 hour
        //update user resetPassword table
        await dbUpdateResetPasswordInfo(userID, token, expires);

        // send reset password email
        var firstname = result[0].FirstName;
        var lastname = result[0].LastName;

        ///send email for change of password
        email.sendForgottenPassword(userEmail, firstname, lastname, token, (err, result) => {
          if(err){
            next(err);
          } else {
            res.json({message: 'reset password email sent'});
          }
        });
      } catch(e) {
        console.log(e);
        res.status(422);
        res.json({message: "username or email not recognised"});
      }
    })
  } else{
    res.status(422);
    res.json({message: "username or email not valid"});
  }

});


router.post('/resetPassword', async(req, res, next) => {
  // check resetToken matches db
  const result = joi.validate(req.body, resetPasswordSchema);
  if(result.error === null) {
    await dbSelectResetPasswordInfo(req.body.resetToken, (err, result) => {
      if(err) next(err);
      try{
        result[0].UserID;
        // check expiry date
        if(result[0].resetExpires > Date.now()) {
          throw new Error();
        }
        // generate new hashedPassword
        bcrypt.hash(req.body.password, hashingRounds).then(async hashedPassword => {
          // update db
          await dbUpdateUserPassword(result[0].UserID, hashedPassword);
        });

        // send email confirmation
        var firstname = result[0].FirstName;
        var lastname = result[0].LastName;
          // send email for change of password
        email.sendChangePassword(result[0].Email, firstname, lastname, (err, result) => {
          if(err){
            next(err);
          } else {
            res.json({message: 'Password changed'});
          }
        });
      } catch(e) {
        res.json({error: "Reset Token invalid or expired"});
      }
    });
    // update db
  } else{
      res.json({error: "invalid password or reset token"});
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
