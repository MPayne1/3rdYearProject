// Handles the backend of team's results

// require in modules
const express = require('express');
const router = express.Router();
const joi = require('joi');

const dbSelectTeamImage = require('../db/select/Team/selectTeamImage.js');
const dbUpdateImage = require('../db/update/updateTeamImage.js');

// all paths are prepended with /team/image
router.get('/', (req, res) => {
  res.json({
    message: 'team image works'
  });
});

// route to handle req for a teams image
router.get('/teamImage', async(req, res, next) => {
  await dbSelectTeamImage(req.body.teamID, (err, result) => {
    if(err) next(err);
    try{
      result[0].imagePath;
      res.json(result);
    } catch(e) {
      res.json({message: 'Team has no image'});
    }
  });
});

// handle the request to change the teams picture
router.post('/newImage', async(req, res, next) => {
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

        file.mv('Client/src/assets/Team Images/' + imageName, async(err) => {
          if(err) next(err);
          await dbUpdateImage(req.body.TeamID, imageName);

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
});

module.exports = router;
