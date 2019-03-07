// handle requests to get the rankings

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// ------  db operations  ------
const dbFootballRankings = require('../../db/select/rankings/selectFootballRankings.js');
const dbRugbyRankings = require('../../db/select/rankings/selectRugbyRankings.js');
const dbAmericanFootballRankings = require('../../db/select/rankings/selectAmericanFootballRankings.js');


// ------  schemas  ------

// ranking schema
const getRankingSchema = joi.object().keys({
  leagueID: joi.number().positive().required()
});

// ------  routes  ------

// all paths are prepended with /league/rankings/fetch
router.get('/', (req, res) => {
  res.json({
    message: 'rankings fetch router works'
  });
});

// route to get football rankings
router.post('/football', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbFootballRankings(leagueID, (err, result) => {
      if(err) next (err);
      try {
        result[0];
        res.json(result);
      } catch (e) {
        invalidInput(res, next)
      }
    });
  } else {
    next(result.error)
  }
});

// route to get rugby rankings
router.post('/rugby', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbRugbyRankings(leagueID, (err, result) => {
      if(err) next (err);
      try {
        result[0];
        res.json(result);
      } catch (e) {
        invalidInput(res, next)
      }
    });
  } else {
    next(result.error)
  }
});

// route to get american football rankings
router.post('/americanFootball', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbAmericanFootballRankings(leagueID, (err, result) => {
      if(err) next (err);
      try {
        result[0];
        res.json(result);
      } catch (e) {
        invalidInput(res, next)
      }
    });
  } else {
    next(result.error)
  }
});



// create/format response for invalid inputs
function invalidInput(res, next) {
  res.status(409);
  var error = new Error("Invlaid Input");
  next(error);
}

module.exports = router;
