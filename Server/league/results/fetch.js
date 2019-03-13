// handle requests to get the result

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// ------  db operations  ------
const dbFootballResults = require('../../db/select/results/selectFootballResults.js');
const dbHockeyResults = require('../../db/select/results/selectHockeyResults.js');
const dbRugbyResults = require('../../db/select/results/selectRugbyResults.js');
const dbAmericanFootballResults = require('../../db/select/results/selectAmericanFootballResults.js');
const dbBasketballResults = require('../../db/select/results/selectBasketballResults.js');
const dbTennisResults = require('../../db/select/results/selectTennisResults.js');
const dbTableTennisResults = require('../../db/select/results/selectTableTennisResults.js');
const dbVolleyballResults = require('../../db/select/results/selectVolleyballResults.js');
// results schema
const getResultsSchema = joi.object().keys({
  leagueID: joi.number().positive().required()
});


// all paths are prepended with /league/rankings/fetch
router.get('/', (req, res) => {
  res.json({
    message: 'results fetch router works'
  });
});


// route to get football results
router.post('/football', async (req, res, next) => {
    const result = joi.validate(req.body, getResultsSchema);
    if(result.error === null) {
      var leagueID = req.body.leagueID;
        await dbFootballResults(leagueID, (err, results) => {
          if(err) next (err);
          try {
            results[0];
            res.json(results);
          } catch (e) {
            invalidInput(res, next)
          }
        });
    } else{
      next(result.error)
    }

});


// route to get hockey results
router.post('/hockey', async(req, res, next) => {
  const result  = joi.validate(req.body, getResultsSchema);
  if(result.error === null) {
    var leagueID = req.body.leagueID;
    await dbHockeyResults(leagueID, (err, results) => {
      if(err) next(err);
      try {
        results[0];
        res.json(results);
      } catch (e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error)
  }
});


// route to get rugby results
router.post('/rugby', async(req, res, next) => {
  const result  = joi.validate(req.body, getResultsSchema);
  if(result.error === null) {
    var leagueID = req.body.leagueID;
    await dbRugbyResults(leagueID, (err, results) => {
      if(err) next(err);
      try {
        results[0];
        res.json(results);
      } catch (e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error)
  }
});


// route to get american football results
router.post('/american%20football', async(req, res, next) => {
  const result  = joi.validate(req.body, getResultsSchema);
  if(result.error === null) {
    var leagueID = req.body.leagueID;
    await dbAmericanFootballResults(leagueID, (err, results) => {
      if(err) next(err);
      try {
        results[0];
        res.json(results);
      } catch (e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error)
  }
});


// route to get basketball results
router.post('/basketball', async(req, res, next) => {
  const result  = joi.validate(req.body, getResultsSchema);
  if(result.error === null) {
    var leagueID = req.body.leagueID;
    await dbBasketballResults(leagueID, (err, results) => {
      if(err) next(err);
      try {
        results[0];
        res.json(results);
      } catch (e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error)
  }
});


// route to get tennis results
router.post('/tennis', async(req, res, next) => {
  const result  = joi.validate(req.body, getResultsSchema);
  if(result.error === null) {
    var leagueID = req.body.leagueID;
    await dbTennisResults(leagueID, (err, results) => {
      if(err) next(err);
      try {
        results[0];
        res.json(results);
      } catch (e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error)
  }
});


// route to get table tennis results
router.post('/table%20tennis', async(req, res, next) => {
  const result  = joi.validate(req.body, getResultsSchema);
  if(result.error === null) {
    var leagueID = req.body.leagueID;
    await dbTableTennisResults(leagueID, (err, results) => {
      if(err) next(err);
      try {
        results[0];
        res.json(results);
      } catch (e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error)
  }
});


// route to get volleyball results
router.post('/volleyball', async(req, res, next) => {
  const result  = joi.validate(req.body, getResultsSchema);
  if(result.error === null) {
    var leagueID = req.body.leagueID;
    await dbVolleyballResults(leagueID, (err, results) => {
      if(err) next(err);
      try {
        results[0];
        res.json(results);
      } catch (e) {
        invalidInput(res, next);
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
