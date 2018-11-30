// handle all team requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const dbSelectTeamNames = require('../db/selectTeamNames.js');
const dbInsert = require('../db/createTeam.js');

const teamSchema = joi.object().keys({
  TeamName: joi.string().min(2).max(20).required(),
  TeamAdmin: joi.number().positive().required(),
  Sport: joi.string().regex(/^[a-zA-Z]{3,30}$/).max(30).required(),
  LeagueID: joi.number().positive().required(),
});

// all paths are prepended with /team
router.get('/', (req, res) => {
  res.json({
    message: 'team router works'
  });
});


// handle create team request
router.post('/create', async(req, res, next) => {
  var TeamName = req.body.TeamName;
  var TeamAdmin = req.body.TeamAdmin;
  var LeagueID = req.body.LeagueID;
  var Sport = req.body.Sport;

  const result = joi.validate(req.body, teamSchema);
  if(result.error == null) {
    var team = await dbSelectTeamNames(TeamName, async function (err, result){
      if(err) next(err);
      try{
          result[0].teamName;
          var error = new Error("That team name is taken please choose another");
          res.status(409);
          next(error);
      } catch(e) {
          await dbInsert(TeamName, TeamAdmin, LeagueID, Sport);
          res.json(req.body);
      }
    })
  }
});

/*
// handle create league request
router.post('/create',async (req, res, next) => {
  console.log(req.body.leagueName)
  var leagueName = req.body.leagueName;
  var Sport = req.body.Sport;
  var leagueAdmin = req.body.leagueAdmin;
  var maxTeams = req.body.maxTeams;
  var loss = req.body.loss;
  var draw = req.body.draw;
  var win = req.body.win;
  var games = req.body.games;
  var city = req.body.city;
  var county = req.body.county;
  var country = req.body.country;

  const result = joi.validate(req.body, leagueSchema);
  if(result.error == null) {
    var league = await dbSelectLeagueNames(leagueName, async function(err, result){
      if(err) next(err);
      try{
        result[0].leagueName;
        var error = new Error("That league name is taken please choose another");
        res.status(409);
        next(error);
      } catch(e) {
          await dbInsert(leagueName, leagueAdmin, Sport, maxTeams, loss, draw,
            win, city, county, country, games);
          res.json(req.body);
      }
    })
  } else{
    res.status(422); // status code for not processable input
    next(result.error); // forwards error to errorHandler
  }
});
*/

module.exports = router;
