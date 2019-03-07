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
const dbBasketballRankings = require('../../db/select/rankings/selectBasketballRankings.js');
const dbHockeyRankings = require('../../db/select/rankings/selectHockeyRankings.js');
const dbVolleyballRankings = require('../../db/select/rankings/selectVolleyballRankings.js');
const dbTennisRankings = require('../../db/select/rankings/selectTennisRankings.js');
const dbTableTennisRankings = require('../../db/select/rankings/selectTableTennisRankings.js');
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

// route to get basketball rankings
router.post('/basketball', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbBasketballRankings(leagueID, (err, result) => {
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

// route to get hockey rankings
router.post('/hockey', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbHockeyRankings(leagueID, (err, result) => {
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

// route to get volleyball rankings
router.post('/volleyball', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbVolleyballRankings(leagueID, (err, result) => {
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

// route to get tennis rankings
router.post('/tennis', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbTennisRankings(leagueID, (err, result) => {
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

// route to get table tennis rankings
router.post('/tableTennis', async (req, res, next) => {
  const result = joi.validate(req.body, getRankingSchema);

  if(result.error === null) {
    var leagueID = req.body.leagueID;
    var rankings = await dbTableTennisRankings(leagueID, (err, result) => {
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
