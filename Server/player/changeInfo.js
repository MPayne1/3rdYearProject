// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const crypto = require('crypto');

const dbUpdatePhoneNumber = require('../db/update/profile/updateUserPhoneNumber.js');
const dbUpdateBio = require('../db/update/profile/updateUserBio.js');
const dbUpdateImage = require('../db/update/profile/updateUserImage.js');
const dbUpdatePubliclyShow = require('../db/update/profile/updatePubliclyShow.js');
// ------  schemas  ------
const phoneNumberSchema = joi.object().keys({
  phoneNumber: joi.string().regex(/^[0-9]{3,15}$/).required()
});

const bioSchema = joi.object().keys({
  Bio: joi.string().regex(/^[_,."£$%^&*(){}@/!'#?-\[\]\w\-\s]{0,200}$/).required()
});

const showSchema = joi.object().keys({
  publiclyShow: joi.any().valid('False', 'True')
});


// ------  routing  ------

// all paths are prepended with /player/profile/changeInfo
router.get('/', (req, res) => {
  res.json({
    message: 'profile change info router works'
  });
});

// route to update a users phoneNumber
router.post('/phoneNumber', async (req, res, next) => {
  const result = joi.validate(req.body, phoneNumberSchema);

  if(result.error === null) {
    // update db
    await dbUpdatePhoneNumber(req.user.UserID, req.body.phoneNumber);
    // send response
    res.json({message: "Phone number updated."});
  } else {
    res.status(422);
    next(result.error);
  }
});



// route to update a users bio
router.post('/Bio', async (req, res, next) => {
  const result = joi.validate(req.body, bioSchema);

  if(result.error === null) {
    // update db
    await dbUpdateBio(req.user.UserID, req.body.Bio);
    // send response
    res.json({message: "Bio updated."});
  } else {
    res.status(422);
    next(result.error);
  }
});

// handle the request to change the users picture
router.post('/picture', async(req, res, next) => {
  try{
    var file = req.files.profileImage;
    var imageName = req.files.profileImage.name;
    // check file size smaller than 10MB
    if(file.size < 10000000) {
      // check file type
      if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg") {
        // add random string to front of name to prevent duplicate names
        var nameSalt = crypto.randomBytes(20).toString('hex');
        imageName = nameSalt + imageName;

        file.mv('Client/src/assets/Profile Pictures/' + imageName, async(err) => {
          if(err) next(err);
          await dbUpdateImage(req.user.UserID, imageName);
          
          console.log(`profile image ${imageName} uploaded`);
          res.json({message: "image uploaded"});
        });
      } else {
        throw new Error();
      }
    } else {
      throw new Error();
    }
  } catch(e){
    res.status(422);
    res.json({message: "Please upload an image in jgp, jpeg or png format smaller than 10MB"})
  }
});

// route to update a users publiclyShow value
router.post('/publiclyShow', async (req, res, next) => {
  const result = joi.validate(req.body, showSchema);

  if(result.error === null) {
    // update db
    await dbUpdatePubliclyShow(req.user.UserID, req.body.publiclyShow);
    // send response
    res.json({message: "Privacy information updated."});
  } else {
    res.status(422);
    next(result.error);
  }
});


module.exports = router;
