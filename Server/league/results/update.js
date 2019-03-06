// Handles the backend of updating league results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

// ------  db operations  ------

const dbSelectUpdateFixtureAdmin = require('../../db/select/selectUpdateFixtureAdmin.js');
const dbInsertFootballResult = require('../../db/insert/insertFootballResults.js');
const dbUpdateFixturePlayed = require('../../db/update/updateFixturePlayed.js');
const dbInsertTennisResult = require('../../db/insert/insertTennisResults.js');
const dbInsertAmericanFootballResult = require('../../db/insert/insertAmericanFootballResults.js');
const dbInsertVolleyballResult = require('../../db/insert/insertVolleyballResults.js');
const dbInsertTableTennisResult = require('../../db/insert/insertTableTennisResults.js');
const dbInsertHockeyResult = require('../../db/insert/insertHockeyResults.js');
const dbInsertBasketballResult = require('../../db/insert/insertBasketballResults.js');
const dbInsertRugbyResult = require('../../db/insert/insertRugbyResults.js');
const dbInsertCricketResult = require('../../db/insert/insertCricketResults.js');
const dbSelectLeaguePoints = require('../../db/select/selectLeaguePoints.js');
const dbUpdateFootballRankings = require('../../db/update/rankings/updateFootballRankings.js');
const dbUpdateRugbyRankings = require('../../db/update/rankings/updateRugbyRankings.js');

// ------  Schemas  ------

// schema for updating football results
const updateFootballResultsSchema  = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomeGoalsScoredHT: joi.number().min(0).required(),
  AwayGoalsScoredHT: joi.number().min(0).required(),
  HomeGoalsScoredFT: joi.number().min(0).required(),
  AwayGoalsScoredFT: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});

// schema for inserting tennis results
const updateTennisResultsSchema  = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredS1: joi.number().min(0).max(7).required(),
  AwayPointsScoredS1: joi.number().min(0).max(7).required(),
  HomePointsScoredS2: joi.number().min(0).max(7).required(),
  AwayPointsScoredS2: joi.number().min(0).max(7).required(),
  HomePointsScoredS3: joi.number().min(0).required(),
  AwayPointsScoredS3: joi.number().min(0).required(),
  HomePointsScoredS4: joi.number().min(0).max(7).required(),
  AwayPointsScoredS4: joi.number().min(0).max(7).required(),
  HomePointsScoredS5: joi.number().min(0).required(),
  AwayPointsScoredS5: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});


// schema for inserting american football / basketball results
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

// schema for inserting volleyball / tabletennis  results
const updateVolleyballResultsSchema =  joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredG1: joi.number().min(0).required(),
  AwayPointsScoredG1: joi.number().min(0).required(),
  HomePointsScoredG2: joi.number().min(0).required(),
  AwayPointsScoredG2: joi.number().min(0).required(),
  HomePointsScoredG3: joi.number().min(0).required(),
  AwayPointsScoredG3: joi.number().min(0).required(),
  HomePointsScoredG4: joi.number().min(0).required(),
  AwayPointsScoredG4: joi.number().min(0).required(),
  HomePointsScoredG5: joi.number().min(0).required(),
  AwayPointsScoredG5: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});

// schema for inserting hockey / rugby results
const updateHockeyResultsSchema  = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomePointsScoredHT: joi.number().min(0).required(),
  AwayPointsScoredHT: joi.number().min(0).required(),
  HomePointsScoredFT: joi.number().min(0).required(),
  AwayPointsScoredFT: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});

// schema for inserting cricket results
const updateCricketResultsSchema  = joi.object().keys({
  FixtureID: joi.number().positive().required(),
  HomeRunsI1: joi.number().min(0).required(),
  AwayRunsI1: joi.number().min(0).required(),
  HomeWicketsLostI1: joi.number().min(0).required(),
  AwayWicketsLostI1: joi.number().min(0).required(),
  HomeRunsI2: joi.number().min(0).required(),
  AwayRunsI2: joi.number().min(0).required(),
  HomeWicketsLostI2: joi.number().min(0).required(),
  AwayWicketsLostI2: joi.number().min(0).required(),
  MatchDescription: joi.string().regex(/^[\w\-\s]{0,300}$/).required(),
});


// all paths are prepended with /league/results/update
router.get('/', (req, res) => {
  res.json({
    message: 'results update router works'
  });
});


// handle request to insert football results
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

        updateFootballRanking(req);
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });


  }
  else {
    next(result.error);
  }
});

// american Football results
router.post('/americanFootball', async(req, res, next) => {
  const result  = joi.validate(req.body, updateAmericanFootballResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomePointsScoredQ1 = req.body.HomePointsScoredQ1;
    var AwayPointsScoredQ1 = req.body.AwayPointsScoredQ1;
    var HomePointsScoredHT = req.body.HomePointsScoredHT;
    var AwayPointsScoredHT = req.body.AwayPointsScoredHT;
    var HomePointsScoredQ3 = req.body.HomePointsScoredQ3;
    var AwayPointsScoredQ3 = req.body.AwayPointsScoredQ3;
    var HomePointsScoredFT = req.body.HomePointsScoredFT;
    var AwayPointsScoredFT = req.body.AwayPointsScoredFT;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/team captain
    var update = dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next (err);
      // if results doesn'thave leagueAdmin user cant update results
      try {
        result[0].leagueAdmin;
        // if user is allowed update results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertAmericanFootballResult(fixtureID, HomePointsScoredQ1
          , AwayPointsScoredQ1, HomePointsScoredHT, AwayPointsScoredHT
          , HomePointsScoredQ3, AwayPointsScoredQ3, HomePointsScoredFT
          , AwayPointsScoredFT, MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  } else {
    next(result.error);
  }
});


// handle req to insert tennis results
router.post('/tennis', async(req, res, next) => {
  const result = joi.validate(req.body, updateTennisResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomePointsScoredS1 = req.body.HomePointsScoredS1;
    var AwayPointsScoredS1 = req.body.AwayPointsScoredS1;
    var HomePointsScoredS2 = req.body.HomePointsScoredS2;
    var AwayPointsScoredS2 = req.body.AwayPointsScoredS2;
    var HomePointsScoredS3 = req.body.HomePointsScoredS3;
    var AwayPointsScoredS3 = req.body.AwayPointsScoredS3;
    var HomePointsScoredS4 = req.body.HomePointsScoredS4;
    var AwayPointsScoredS4 = req.body.AwayPointsScoredS4;
    var HomePointsScoredS5 = req.body.HomePointsScoredS5;
    var AwayPointsScoredS5 = req.body.AwayPointsScoredS5;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/captain
    var update = await dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next(err);
      // if result doesn't have league/team Admin then user can't update resuts
      try {
        result[0].leagueAdmin;
        // if user is allowed, update the results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertTennisResult(fixtureID, HomePointsScoredS1
          , AwayPointsScoredS1, HomePointsScoredS2, AwayPointsScoredS2
          , HomePointsScoredS3, AwayPointsScoredS3, HomePointsScoredS4
          , AwayPointsScoredS4,  HomePointsScoredS5, AwayPointsScoredS5
          ,MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  }
  else {
    next(result.error);
  }
});


// handle req to insert volleyball results
router.post('/volleyball', async(req, res, next) => {
  const result = joi.validate(req.body, updateVolleyballResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomePointsScoredG1 = req.body.HomePointsScoredG1;
    var AwayPointsScoredG1 = req.body.AwayPointsScoredG1;
    var HomePointsScoredG2 = req.body.HomePointsScoredG2;
    var AwayPointsScoredG2 = req.body.AwayPointsScoredG2;
    var HomePointsScoredG3 = req.body.HomePointsScoredG3;
    var AwayPointsScoredG3 = req.body.AwayPointsScoredG3;
    var HomePointsScoredG4 = req.body.HomePointsScoredG4;
    var AwayPointsScoredG4 = req.body.AwayPointsScoredG4;
    var HomePointsScoredG5 = req.body.HomePointsScoredG5;
    var AwayPointsScoredG5 = req.body.AwayPointsScoredG5;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/captain
    var update = await dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next(err);
      // if result doesn't have league/team Admin then user can't update resuts
      try {
        result[0].leagueAdmin;
        // if user is allowed, update the results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertVolleyballResult(fixtureID, HomePointsScoredG1
          , AwayPointsScoredG1, HomePointsScoredG2, AwayPointsScoredG2
          , HomePointsScoredG3, AwayPointsScoredG3, HomePointsScoredG4
          , AwayPointsScoredG4,  HomePointsScoredG5, AwayPointsScoredG5
          ,MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  }
  else {
    next(result.error);
  }
});


// handle req to insert table tennis results
router.post('/tableTennis', async(req, res, next) => {
  const result = joi.validate(req.body, updateVolleyballResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomePointsScoredG1 = req.body.HomePointsScoredG1;
    var AwayPointsScoredG1 = req.body.AwayPointsScoredG1;
    var HomePointsScoredG2 = req.body.HomePointsScoredG2;
    var AwayPointsScoredG2 = req.body.AwayPointsScoredG2;
    var HomePointsScoredG3 = req.body.HomePointsScoredG3;
    var AwayPointsScoredG3 = req.body.AwayPointsScoredG3;
    var HomePointsScoredG4 = req.body.HomePointsScoredG4;
    var AwayPointsScoredG4 = req.body.AwayPointsScoredG4;
    var HomePointsScoredG5 = req.body.HomePointsScoredG5;
    var AwayPointsScoredG5 = req.body.AwayPointsScoredG5;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/captain
    var update = await dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next(err);
      // if result doesn't have league/team Admin then user can't update resuts
      try {
        result[0].leagueAdmin;
        // if user is allowed, update the results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertTableTennisResult(fixtureID, HomePointsScoredG1
          , AwayPointsScoredG1, HomePointsScoredG2, AwayPointsScoredG2
          , HomePointsScoredG3, AwayPointsScoredG3, HomePointsScoredG4
          , AwayPointsScoredG4,  HomePointsScoredG5, AwayPointsScoredG5
          ,MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  }
  else {
    next(result.error);
  }
});



// hockey results
router.post('/hockey', async(req, res, next) => {
  const result  = joi.validate(req.body, updateHockeyResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomePointsScoredHT = req.body.HomePointsScoredHT;
    var AwayPointsScoredHT = req.body.AwayPointsScoredHT;
    var HomePointsScoredFT = req.body.HomePointsScoredFT;
    var AwayPointsScoredFT = req.body.AwayPointsScoredFT;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/team captain
    var update = dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next (err);
      // if results doesn'thave leagueAdmin user cant update results
      try {
        result[0].leagueAdmin;
        // if user is allowed update results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertHockeyResult(fixtureID, HomePointsScoredHT,
          AwayPointsScoredHT, HomePointsScoredFT, AwayPointsScoredFT
          , MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  } else {
    next(result.error);
  }
});



// basketball results
router.post('/basketball', async(req, res, next) => {
  const result  = joi.validate(req.body, updateAmericanFootballResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomePointsScoredQ1 = req.body.HomePointsScoredQ1;
    var AwayPointsScoredQ1 = req.body.AwayPointsScoredQ1;
    var HomePointsScoredHT = req.body.HomePointsScoredHT;
    var AwayPointsScoredHT = req.body.AwayPointsScoredHT;
    var HomePointsScoredQ3 = req.body.HomePointsScoredQ3;
    var AwayPointsScoredQ3 = req.body.AwayPointsScoredQ3;
    var HomePointsScoredFT = req.body.HomePointsScoredFT;
    var AwayPointsScoredFT = req.body.AwayPointsScoredFT;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/team captain
    var update = dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next (err);
      // if results doesn'thave leagueAdmin user cant update results
      try {
        result[0].leagueAdmin;
        // if user is allowed update results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertBasketballResult(fixtureID, HomePointsScoredQ1
          , AwayPointsScoredQ1, HomePointsScoredHT, AwayPointsScoredHT
          , HomePointsScoredQ3, AwayPointsScoredQ3, HomePointsScoredFT
          , AwayPointsScoredFT, MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  } else {
    next(result.error);
  }
});




// rugby results
router.post('/rugby', async(req, res, next) => {
  const result  = joi.validate(req.body, updateHockeyResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomePointsScoredHT = req.body.HomePointsScoredHT;
    var AwayPointsScoredHT = req.body.AwayPointsScoredHT;
    var HomePointsScoredFT = req.body.HomePointsScoredFT;
    var AwayPointsScoredFT = req.body.AwayPointsScoredFT;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/team captain
    var update = dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next (err);
      // if results doesn'thave leagueAdmin user cant update results
      try {
        result[0].leagueAdmin;
        // if user is allowed update results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertRugbyResult(fixtureID, HomePointsScoredHT,
          AwayPointsScoredHT, HomePointsScoredFT, AwayPointsScoredFT
          , MatchDescription, (err) => {
            if(err) next(err);
        });
        // updateRugbyRanking;
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  } else {
    next(result.error);
  }
});


// cricket results
router.post('/cricket', async(req, res, next) => {
  const result  = joi.validate(req.body, updateCricketResultsSchema);
  if(result.error === null) {
    var userID = req.user.UserID;
    var fixtureID = req.body.FixtureID;
    var HomeRunsI1 = req.body.HomeRunsI1;
    var AwayRunsI1 = req.body.AwayRunsI1;
    var HomeWicketsLostI1 = req.body.HomeWicketsLostI1;
    var AwayWicketsLostI1 = req.body.AwayWicketsLostI1;
    var HomeRunsI2 = req.body.HomeRunsI2;
    var AwayRunsI2 = req.body.AwayRunsI2;
    var HomeWicketsLostI2 = req.body.HomeWicketsLostI2;
    var AwayWicketsLostI2 = req.body.AwayWicketsLostI2;
    var MatchDescription = req.body.MatchDescription;

    // check user is admin/team captain
    var update = dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next (err);
      // if results doesn'thave leagueAdmin user cant update results
      try {
        result[0].leagueAdmin;
        // if user is allowed update results
        updateFixturePlayed(fixtureID);
        var insert = await dbInsertCricketResult(fixtureID, HomeRunsI1
          , AwayRunsI1, HomeWicketsLostI1, AwayWicketsLostI1
          , HomeRunsI2, AwayRunsI2, HomeWicketsLostI2
          , AwayWicketsLostI2, MatchDescription, (err) => {
            if(err) next(err);
        });
        res.json(req.body);
      } catch(e) {
        unauthorisedUser(res, next)
      }
    });
  } else {
    next(result.error);
  }
});



// update football Ranking
async function updateFootballRanking(req) {
  var win = 0;
  var draw = 0;
  var loss = 0;
  var seasonID;
  var HomeTeamID;
  var AwayTeamID;
  var HomeGoalsScored = req.body.HomeGoalsScoredFT;
  var AwayGoalsScored = req.body.AwayGoalsScoredFT;
  // get points info from leageue table
  await dbSelectLeaguePoints(req.body.FixtureID, async (err, result) => {
    if(err) next(err);
    try{
      result[0];
      win = result[0].pointsForWin;
      draw = result[0].pointsForDraw;
      loss = result[0].pointsForLoss;
      seasonID = result[0].seasonID;
      HomeTeamID = result[0].HomeTeamID;
      AwayTeamID = result[0].AwayTeamID;

      // home team wins
      if(req.body.HomeGoalsScoredFT > req.body.AwayGoalsScoredFT) {
        // update home team ranking
        await dbUpdateFootballRankings(seasonID, HomeTeamID, 1, 0, 0, HomeGoalsScored, AwayGoalsScored, win);
        // update away team ranking
        await dbUpdateFootballRankings(seasonID, AwayTeamID, 0, 0, 1, AwayGoalsScored, HomeGoalsScored, loss);
      } // away team wins
      else if(req.body.HomeGoalsScoredFT < req.body.AwayGoalsScoredFT) {
        // update away team ranking
        await dbUpdateFootballRankings(seasonID, AwayTeamID, 1, 0, 0, AwayGoalsScored, HomeGoalsScored, win);
        // update home team ranking
        await dbUpdateFootballRankings(seasonID, HomeTeamID, 0, 0, 1, HomeGoalsScored, AwayGoalsScored, loss);
      } // draw
      else {
        // update away team ranking
        await dbUpdateFootballRankings(seasonID, AwayTeamID, 0, 1, 0, AwayGoalsScored, HomeGoalsScored, draw);
        // update home team ranking
        await dbUpdateFootballRankings(seasonID, HomeTeamID, 0, 1, 0, HomeGoalsScored, AwayGoalsScored, draw);
      }
    } catch(e){
      next(e);
    }
  });
}


// update Rugby Ranking
async function updateRugbyRanking(req) {
  var win = 0;
  var draw = 0;
  var loss = 0;
  var seasonID;
  var HomeTeamID;
  var AwayTeamID;
  var HomePointsScored = req.body.HomePointsScoredFT;
  var AwayPointsScored = req.body.AwayPointsScoredFT;
  // get points info from leageue table
  await dbSelectLeaguePoints(req.body.FixtureID, async (err, result) => {
    if(err) next(err);
    try{
      result[0];
      win = result[0].pointsForWin;
      draw = result[0].pointsForDraw;
      loss = result[0].pointsForLoss;
      seasonID = result[0].seasonID;
      HomeTeamID = result[0].HomeTeamID;
      AwayTeamID = result[0].AwayTeamID;

      // home team wins
      if(HomePointsScored > AwayPointsScored) {
        // update home team ranking
        await dbUpdateRugbylRankings(seasonID, HomeTeamID, 1, 0, 0, HomePointsScored, AwayPointsScored, win);
        // update away team ranking
        await dbUpdateRugbylRankings(seasonID, AwayTeamID, 0, 0, 1, AwayGoalsScored, HomePointsScored, loss);
      } // away team wins
      else if(HomePointsScored < AwayPointsScored) {
        // update away team ranking
        await dbUpdateRugbylRankings(seasonID, AwayTeamID, 1, 0, 0, AwayPointsScored, HomePointsScored, win);
        // update home team ranking
        await dbUpdateRugbylRankings(seasonID, HomeTeamID, 0, 0, 1, HomePointsScored, AwayPointsScored, loss);
      } // draw
      else {
        // update away team ranking
        await dbUpdateRugbylRankings(seasonID, AwayTeamID, 0, 1, 0, AwayPointsScored, HomePointsScored, draw);
        // update home team ranking
        await dbUpdateRugbylRankings(seasonID, HomeTeamID, 0, 1, 0, HomePointsScored, AwayPointsScored, draw);
      }
    } catch(e){
      next(e);
    }
  });
}

// call db to update fixture played to true
async function updateFixturePlayed (fixtureID) {
  var update = await dbUpdateFixturePlayed(fixtureID, 'true', (err) => {
    if(err) next(err);
  });
}

// create/format response for unauthorised user
function unauthorisedUser(res, next) {
  var error = new Error("Only league admins and team captains can update reuslts");
  res.status(403);
  next(error);
}


module.exports = router;
