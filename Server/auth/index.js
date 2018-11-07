//Handles the backend of auth

// require in modules
const express = require('express');
const joi = require('joi');
const bcrypt = require('bcryptjs');

const dbSelect = require('../db/select.js')

const router = express.Router();
const schema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().min(8).required() // password must be 8 char long
});
// any route in here is pre-prended with /auth

router.get('/', (req, res) => {
  res.json({
    message: 'router works'
  });
});

 router.post('/signup', async (req, res, next) => {
  console.log('body', req.body );
  const result = joi.validate(req.body, schema);
  if(result.error === null) {
    var users =  await dbSelect(req.body.username);
    //if always true -- need to fix
    if(users === []) { // if users exists then not available
      var err = new Error('duplicate username');
      next(err);
    } else {
      res.json(req.body);
      console.log("unique username");//if username is unique return the body
    }
  } else{
      next(result.error); // forwards error to errorHandler
  }
});


module.exports = router;
