// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const changeInfo = require('./changeInfo.js');


const dbSelectUserInfo = require('../db/select/selectUserInfo.js');
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
router.post('/view', async (req, res, next) => {
  const result = joi.validate(req.body, viewProfileSchema);

  if(result.error === null) {
    // get user info
    await dbSelectUserInfo(req.body.UserID, (err, result) => {
      if(err) next(err);
      try {
        // check if profile requested matches the logged in user if yes send info
        if(req.body.UserID === req.user.UserID) {
          res.json(result);
        }
        // if not check publicly show value
        else if(result[0].publiclyShow == 'True') {
          res.json(result);
        } else {
          res.json({message: "This user has no information to publicly show."});
        }
      }catch(e) {
        next(e)
      }
    });
  } else {
    res.status(422);
    next(result.error);
  }
})


router.use('/changeInfo', changeInfo);
module.exports = router;
