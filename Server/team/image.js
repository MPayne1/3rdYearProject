// Handles the backend of team's results

// require in modules
const express = require('express');
const router = express.Router();
const joi = require('joi');

const dbSelectTeamImage = require('../db/select/Team/selectTeamImage.js');


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



module.exports = router;
