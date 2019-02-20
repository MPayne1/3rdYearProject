// Handles the backend of updating league results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// ------ Schemas ------

// schema for updating football results
const updateFootballResultsSchema  = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomeTeamScoreHT: joi.number().min(0).required(),
  AwayTeamScoreHT: joi.number().min(0).required(),
  HomeTeamScoreFT: joi.number().min(0).required(),
  AwayTeamScoreFT: joi.number().min(0).required()
});

// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'results update router works'
  });
});


// handle request to update football results
router.post('/football', async(req, res, next) => {
  const result = joi.validate(req.body, updateFootballResultsSchema);
  if(result.error === null) {
    res.json(req.body);
  }
  else {
    res.json(result.error);
  }
});

/*
// handle get leagueID from leagueName request
router.post('/leagueID', async(req, res, next) => {
  const result  = joi.validate(req.body, leagueIDSchema);
  if(result.error === null) {
    var players  = await dbSelectLeagueID(req.body.leagueName, async function(err, result){
      if(err) next(err);
      try{
        result[0].leagueID;
        res.json({result});
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else{
    invalidInput(res, next);
  }
});
*/
module.exports = router;
