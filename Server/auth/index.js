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
  //console.log('body', req.body );
  var username = req.body.username;
  const result = joi.validate(req.body, schema);
  if(result.error === null) {
    var users = await dbSelect(username, function(err, result){
      if(err) next(err);
      // try to get the username from the sql query result, if it throws an error the username is free
      try {
        result[0].username;
        var error = new Error("duplicate username");
        next(error);
      } catch(e) {
        res.json(req.body);
      }
    });
  } else{
    next(result.error); // forwards error to errorHandler
  }
});


module.exports = router;
