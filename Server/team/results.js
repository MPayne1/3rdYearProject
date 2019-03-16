// Handles the backend of team's results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

// ------  db operations  ------
const dbSelectFootballResults = require('../db/select/results/teamResults/selectFootballTeamResults.js');
const dbSelectTennisResults = require('../db/select/results/teamResults/selectTennisTeamResults.js');
const dbAmericanFootballResults = require('../db/select/results/teamResults/selectAmericanFootballTeamResults.js');
const dbBasketballResults = require('../db/select/results/teamResults/selectBasketballTeamResults.js');
const dbHockeyResults = require('../db/select/results/teamResults/selectHockeyTeamResults.js');
const dbRugbyResults = require('../db/select/results/teamResults/selectRugbyTeamResults.js');

// ------  schemas  ------
//schema for teams results
const teamResultSchema = joi.object().keys({
  teamID: joi.number().positive().required(),
});

// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'team results router works'
  });
});

// route to get the football teams results
router.post('/football', async(req, res, next) => {
  const result = joi.validate(req.body, teamResultSchema);
  if(result.error === null) {
    await dbSelectFootballResults(req.body.teamID, (err, result)=> {
      if(err) next(err);
      try{
        result[0];
        res.json(result);
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else{
    next(result.error);
  }
});

// route to get the tennis teams results
router.post('/tennis', async(req, res, next) => {
  const result = joi.validate(req.body, teamResultSchema);
  if(result.error === null) {
    await dbSelectTennisResults(req.body.teamID, (err, result)=> {
      if(err) next(err);
      try{
        result[0];
        res.json(result);
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else{
    next(result.error);
  }
});

// route to get the american football teams results
router.post('/american%20football', async(req, res, next) => {
  const result = joi.validate(req.body, teamResultSchema);
  if(result.error === null) {
    await dbAmericanFootballResults(req.body.teamID, (err, result) => {
      if(err) next(err);
      try{
        result[0];
        res.json(result);
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error);
  }
});

// route to get the basketball teams results
router.post('/basketball', async(req, res, next) => {
  const result = joi.validate(req.body, teamResultSchema);
  if(result.error === null) {
    await dbBasketballResults(req.body.teamID, (err, result) => {
      if(err) next(err);
      try{
        result[0];
        res.json(result);
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error);
  }
});

// route to get the hockey teams results
router.post('/hockey', async(req, res, next) => {
  const result = joi.validate(req.body, teamResultSchema);
  if(result.error === null) {
    await dbHockeyResults(req.body.teamID, (err, result) => {
      if(err) next(err);
      try{
        result[0];
        res.json(result);
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error);
  }
});


// route to get the rugby teams results
router.post('/rugby', async(req, res, next) => {
  const result = joi.validate(req.body, teamResultSchema);
  if(result.error === null) {
    await dbRugbyResults(req.body.teamID, (err, result) => {
      if(err) next(err);
      try{
        result[0];
        res.json(result);
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else {
    next(result.error);
  }
});






// create/format response for invalid inputs
function invalidInput(res, next) {
  res.status(409);
  var error = new Error("Invlaid Input");
  next(error);
}
module.exports = router;
