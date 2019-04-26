// Handles the backend of team's results

// require in modules
const express = require('express');
const router = express.Router();
const joi = require('joi');
const crypto = require('crypto');


const dbSelectTeamImage = require('../db/select/Team/selectTeamImage.js');
const dbUpdateImage = require('../db/update/updateTeamImage.js');
const dbSelectCaptain = require('../db/select/Team/selectTeamCaptain.js');
// ------  Schemas  ------
const imageSchema = joi.object().keys({
  TeamID: joi.number().positive().required(),
});


// ------  Routes  ------
// all paths are prepended with /team/image
router.get('/', (req, res) => {
  res.json({
    message: 'team image works'
  });
});

// route to handle req for a teams image
router.post('/teamImage', async(req, res, next) => {
  const result = joi.validate(req.body, teamSchema);

  if(result.error === null) {
    await dbSelectTeamImage(req.body.TeamID, (err, result) => {
      if(err) next(err);
      try{
        result[0].imagePath;
        res.json(result);
      } catch(e) {
        res.json({message: 'Team has no image'});
      }
    });
  } else {
    next(result.error);
  }

});

// handle the request to change the teams picture
router.post('/newImage/:TeamID', async(req, res, next) => {

  if(req.params.TeamID) {
    var teamID = req.params.TeamID;
    // check user is teamAdmin
    await dbSelectCaptain(req.user.UserID,teamID, async (err, result) => {
      if(err) next(err);
      try{
        result[0].TeamAdmin;
        // update the image
        try{
          var file = req.files.teamImage;
          var imageName = req.files.teamImage.name;
          // check file size smaller than 10MB
          if(file.size < 10000000) {
            // check file type
            if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg") {
              // add random string to front of name to prevent duplicate names
              var nameSalt = crypto.randomBytes(20).toString('hex');
              imageName = nameSalt + imageName;
              // save the image
              file.mv('Client/src/assets/Team Images/' + imageName, async(err) => {
                if(err) next(err);
                await dbUpdateImage(teamID, imageName);

                console.log(`team image ${imageName} uploaded`);
                res.json({message: "Team Image Changed", imagePath: imageName});
              });
            } else {
              throw new Error();
            }
          } else {
            throw new Error();
          }
        } catch(e){
          res.status(422);
          res.json({errorMessage: "Please upload an image in jgp, jpeg or png format smaller than 10MB"})
        }
      } catch(e) {
        var error = new Error("Only the team Admin/captain can change the team image.");
        res.status(409);
        next(error);
      }
    });

  } else {
    next(error);
  }

});

module.exports = router;
