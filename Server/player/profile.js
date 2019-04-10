// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const changeInfo = require('./changeInfo.js');


const dbSelectUserInfo = require('../db/select/Users/selectUserInfo.js');
const dbSelectUserImage = require('../db/select/Users/selectUserImage.js');
// ------  schemas  ------

const viewProfileSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
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
    await dbSelectUserInfo(req.body.username, (err, result) => {
      if(err) next(err);
      try {
        console.log(result);
        // check if profile requested matches the logged in user if yes send info
        if(result[0].UserID === req.user.UserID) {
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

// route to handle req for a users profile image
router.get('/profileImage', async(req, res, next) => {
  await dbSelectUserImage(req.user.UserID, (err, result) => {
    if(err) next(err);
    try{
      result[0].imagePath;
      res.json(result);
    } catch(e) {
      res.json({message: 'User has no image'});
    }
  });
});

router.use('/changeInfo', changeInfo);
module.exports = router;
