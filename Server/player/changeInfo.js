// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// ------  schemas  ------
const phoneNumberSchema = joi.object().keys({
  phoneNumber: joi.string().alphanum().max(15).required()
});

//Bio: joi.string().regex(/^[\w\-\s]{0,200}$/).required(),
//publiclyShow: joi.any().valid('False', 'True')

// ------  routing  ------

// all paths are prepended with /player/profile/changeInfo
router.get('/', (req, res) => {
  res.json({
    message: 'profile change info router works'
  });
});


router.post('/phoneNumber', (req, res, next) => {
  const result = joi.validate(req.body, phoneNumberSchema);

  if(result.error === null) {
    //update db

    // send response


  } else {
    res.status(422);
    next(result.error);
  }
});


module.exports = router;
