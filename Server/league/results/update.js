// Handles the backend of updating league results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

// ------  db operations  ------

const dbSelectUpdateFixtureAdmin = require('../../db/selectUpdateFixtureAdmin.js');
const dbInsertFootballResult = require('../../db/insert/insertFootballResults.js');
const dbUpdateFixturePlayed = require('../../db/update/updateFixturePlayed.js');

// ------ Schemas ------

// schema for updating football results
const updateFootballResultsSchema  = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomeGoalsScoredHT: joi.number().min(0).required(),
  AwayGoalsScoredHT: joi.number().min(0).required(),
  HomeGoalsScoredFT: joi.number().min(0).required(),
  AwayGoalsScoredFT: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});

// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'results update router works'
  });
});


// handle request to update football results
router.post('/football', async(req, res, next) => {
  var userID = req.user.UserID;
  var fixtureID  = req.body.FixtureID;
  var HomeGoalsScoredHT = req.body.HomeGoalsScoredHT;
  var AwayGoalsScoredHT = req.body.AwayGoalsScoredHT;
  var HomeGoalsScoredFT = req.body.HomeGoalsScoredFT;
  var AwayGoalsScoredFT = req.body.AwayGoalsScoredFT;
  var MatchDescription = req.body.MatchDescription;

  const result = joi.validate(req.body, updateFootballResultsSchema);
  if(result.error === null) {
    // check user is captain of one of the teams or the league admin
    var admin = await dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next(err);
      // if result doesn't have league/team Admin then user can't update resuts
      try {
        result[0].leagueAdmin;
      } catch(e) {
        var error = new Error("Only league admins and team captains can update fixture information");
        res.status(403);
        next(error);
      }
    });

    // if user is allowed, update the results
    var insert = await dbInsertFootballResult(fixtureID, HomeGoalsScoredHT,
      AwayGoalsScoredHT, HomeGoalsScoredFT, AwayGoalsScoredFT, MatchDescription, (err) => {
        if(err) next(err);
      });

    updateFixturePlayed(fixtureID);

    res.json(req.body);
  }
  else {
    next(result.error);
  }
});


// call db to update fixture played to true
async function updateFixturePlayed (fixtureID) {
  // update fixture.played to true
  var update = await dbUpdateFixturePlayed(fixtureID, 'true', (err) => {
    if(err)next(err);
  });
}

module.exports = router;
