// handle requests to get the result

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// ------  db operations  ------
const dbFootballResults = require('../../db/select/results/selectFootballResults.js');

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
  
});


// create/format response for invalid inputs
function invalidInput(res, next) {
  res.status(409);
  var error = new Error("Invlaid Input");
  next(error);
}

module.exports = router;
