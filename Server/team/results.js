// Handles the backend of team's results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

// ------  db operations  ------
const dbSelectFootballResults = require('../db/select/results/teamResults/selectFootballTeamResults.js');

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


router.post('/football', async(req, res, next) => {
  const result = joi.validate(req.body, teamResultSchema);
  if(result.error === null) {
    await dbSelectFootballResults(req.body.teamID, (err, result)=> {
      if(err) next(err);
      try{
        result[0];
        res.json(result);
      } catch(e) {
        next(e);
      }
    })
  }
});

module.exports = router;
