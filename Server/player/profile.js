// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const changeInfo = require('./changeInfo.js');

// ------  schemas  ------

const viewProfileSchema = joi.object().keys({
  UserID: joi.number().positive().required()
});

// ------  routing  ------

// all paths are prepended with /player/profile
router.get('/', (req, res) => {
  res.json({
    message: 'player profile router works'
  });
});


// route to view a users profile
router.post('/view', (req, res, next) => {
  const result = joi.validate(req.body, viewProfileSchema);

  if(result.error === null) {
    // get user info

    // check if profile requested matches the logged in user
    // if yes send info
    // if not check publicly show value


  } else {
    res.status(422);
    next(result.error);
  }
})


router.use('/changeInfo', changeInfo);
module.exports = router;
