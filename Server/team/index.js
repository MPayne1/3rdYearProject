// handle all team requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const dbSelectTeamNames = require('../db/select/selectTeamNames.js');
const dbInsert = require('../db/insert/createTeam.js');
const dbSelectPlayer = require('../db/select/selectPlayers.js');
const dbInsertPlayer = require('../db/insert/addPlayers.js');
const dbSelectCaptain = require('../db/select/selectTeamCaptain.js');
const dbSelectPlaysFor = require('../db/select/selectPlaysFor.js');
const dbSelectAllPlayers = require('../db/select/selectAllPlayers.js');
const dbSelectTeamID = require('../db/select/selectTeamID.js');
const dbInsertPlayerTeamname = require('../db/insert/insertPlayerTeamName.js');

const teamSchema = joi.object().keys({
  TeamName: joi.string().min(2).max(20).required(),
  TeamAdmin: joi.number().positive().required(),
  Sport: joi.string().regex(/^[a-zA-Z\s]{3,30}$/).max(30).required(),
  LeagueID: joi.number().positive().required(),
});

const teamIDSchema = joi.object().keys({
  teamName: joi.string().min(2).max(20).required(),
});

const addplayerSchema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  teamID: joi.number().positive().required(),
});

const allPlayersSchema = joi.object().keys({
  teamName: joi.string().min(2).max(20).required(),
});


// all paths are prepended with /team
router.get('/', (req, res) => {
  res.json({
    message: 'team router works'
  });
});


// handle request to get all players of a team
router.post('/allplayers', async(req, res, next) => {
  const result  = joi.validate(req.body, allPlayersSchema);
  if(result.error === null) {
    var players  = await dbSelectAllPlayers(req.body.teamName, async function(err, result){
      if(err) next(err);
      try{
        result[0].username;
        console.log(result);
        res.json({result});
      //  console.log(result);
      } catch(e) {
        res.json({message: "There are no players in this team yet."});
      }
    });
  } else{
    invalidInput(res, next);
  }
});




// handle request for teams a user playsfor
router.post('/playsfor', async (req, res, next) => {
  var playsfor = await dbSelectPlaysFor(req.user.UserID, async function (err, result) {
    if(err) next(err);
    try {
      result[0].teamName;
      res.json({result});
    } catch(e) {
      res.json({message: "no teams"});
    }
  });
});



// handle create team request
router.post('/create', async(req, res, next) => {
  var TeamName = req.body.TeamName;
  // set teamadmin to be the user making request, from the jwt
  var TeamAdmin = req.user.UserID;
  var LeagueID = req.body.LeagueID;
  var Sport = req.body.Sport;

  const result = joi.validate(req.body, teamSchema);
  if(result.error === null) {
    // check teamname isn't taken
    var team = await dbSelectTeamNames(TeamName, async function (err, result){
      if(err) next(err);
      try{
          result[0].teamName;
          var error = new Error("That team name is taken please choose another");
          res.status(409);
          next(error);
      } catch(e) {
        await dbInsert(TeamName, TeamAdmin, LeagueID, Sport);
        await dbInsertPlayerTeamname(TeamAdmin, TeamName);
        res.json(req.body);
      }
    })
  } else {
    invalidInput(res, next);
  }
});


// handle add player
router.post('/addPlayer', async (req, res, next) => {
  var username = req.body.username;
  var user = req.user.UserID;
  var teamID = req.body.teamID;

  const result = joi.validate(req.body, addplayerSchema);

  if(result.error === null) {
    // check user adding new player is captain
    var captain = await dbSelectCaptain(user, teamID, async function(er, result2) {
      if(er) next(er);
      try {
        result2[0].TeamAdmin;
      } catch(e) {
        var error = new Error("Only the teamAdmin/captain can add new players");
        res.status(409);
        next(error);
      }
    });

    var player = await dbSelectPlayer(username, teamID, async function(err, result){
      if(err) next(err);
      // if they are captain then add the new player, if not already in team
      try{
        result[0].userId;
        var error = new Error("User is already in the team");
        res.status(422);
        next(error);
      } catch(e) {
        await dbInsertPlayer(username, teamID, async function(err, result) {
          if(err) {
            var error = new Error("Username doesn't exist");
            next(error);
          } else {
            res.json(req.body);
          }
        });
      }
    });
  } else {
  invalidInput(res, next);
  }
});


// handle request to get teamID based on teamname
router.post('/teamID', async(req, res, next) => {
  const result  = joi.validate(req.body, teamIDSchema);
  if(result.error === null) {
    var players  = await dbSelectTeamID(req.body.teamName, async function(err, result){
      if(err) next(err);
      try{
        result[0].teamID;
        res.json({result});
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else{
    invalidInput(res, next);
  }
});

// create response for invalid inputs
function invalidInput(res, next) {
  res.status(409);
  var error = new Error("Invlaid Input");
  next(error);
}

module.exports = router;
