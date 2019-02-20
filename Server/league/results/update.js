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

// schema for inserting american football results
const updateAmericanFootballResultsSchema  = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredQ1: joi.number().min(0).required(),
  AwayPointsScoredQ1: joi.number().min(0).required(),
  HomePointsScoredHT: joi.number().min(0).required(),
  AwayPointsScoredHT: joi.number().min(0).required(),
  HomePointsScoredQ3: joi.number().min(0).required(),
  AwayPointsScoredQ3: joi.number().min(0).required(),
  HomePointsScoredFT: joi.number().min(0).required(),
  AwayPointsScoredFT: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});


// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'results update router works'
  });
});


// handle request to insert football results
router.post('/football', async(req, res, next) => {
  var userID = req.user.UserID;
  console.log(userID);
  var fixtureID  = req.body.FixtureID;
  var HomeGoalsScoredHT = req.body.HomeGoalsScoredHT;
  var AwayGoalsScoredHT = req.body.AwayGoalsScoredHT;
  var HomeGoalsScoredFT = req.body.HomeGoalsScoredFT;
  var AwayGoalsScoredFT = req.body.AwayGoalsScoredFT;
  var MatchDescription = req.body.MatchDescription;

  const result = joi.validate(req.body, updateFootballResultsSchema);
  if(result.error === null) {
    // check user is admin/captain
    var update = await dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next(err);
      // if result doesn't have league/team Admin then user can't update resuts
      try {
        result[0].leagueAdmin;
        // if user is allowed, update the results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertFootballResult(fixtureID, HomeGoalsScoredHT,
          AwayGoalsScoredHT, HomeGoalsScoredFT, AwayGoalsScoredFT, MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        var error = new Error("Only league admins and team captains can update reuslts");
        res.status(403);
        next(error);
      }
    });
  }
  else {
    next(result.error);
  }
});

// american Football results
router.post('/americanFootball', async(req,res, next) => {
  var userID = req.user.UserID;
  var fixtureID  = req.body.FixtureID;
})


// handle req to insert tennis results

// Rugby
// Tennis
// tableTennis
// cricket
// hockey
// volleyball
// basketball


// call db to update fixture played to true
async function updateFixturePlayed (fixtureID) {
  var update = await dbUpdateFixturePlayed(fixtureID, 'true', (err) => {
    if(err)next(err);
  });
}

module.exports = router;
