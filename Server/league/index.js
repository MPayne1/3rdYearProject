// Handles the backend of the league

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const resultsRoute = require('./results/index.js');
const fixturesRoute = require('./fixtures/index.js');
const rankingsRoute = require('./rankings/index.js');
const announcementsRoute = require('./LeagueAnnouncements.js');
// ------  db operations  ------

const dbSelectLeagueNames = require('../db/select/selectLeagueNames.js');
const dbInsert = require('../db/insert/createLeague.js');
const dbSelectLeagues = require('../db/select/selectLeagueFromCity.js');
const dbSelectLeagueAdmin = require('../db/select/selectLeagueAdmin.js');
const dbSelectTeamsInLeague = require('../db/select/selectTeamsInLeague.js');
const dbSelectLeaguesPlayIn = require('../db/select/selectLeaguesPlayIn.js');
const dbSelectLeagueID = require('../db/select/selectLeagueID.js');
const dbSelectLeagueSport = require('../db/select/selectLeagueSport.js');
const dbSelectTeamAdminsInLeague = require('../db/select/selectTeamAdminsInLeague.js');

//------  schemas  ------

// schema for input validation
const leagueSchema = joi.object().keys({
  leagueName: joi.string().min(2).max(20).required(),
  leagueAdmin: joi.number().positive().required(),
  Sport: joi.string().regex(/^[a-zA-Z\s]{3,30}$/).max(30).required(),
  maxTeams: joi.number().positive().required(),
  loss: joi.number().min(0).required(),
  draw: joi.number().min(0).required(),
  win: joi.number().positive().required(),
  city: joi.string().min(2).max(30).required(),
  county: joi.string().min(2).max(30).required(),
  country: joi.string().min(2).max(30).required(),
  games: joi.number().positive().required()
});

// schema for searching for a league
const findLeagueSchema  = joi.object().keys({
  city: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required(),
  county: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required(),
  country: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required(),
  sport: joi.string().regex(/^[a-zA-Z\s]{2,30}$/).required()
});

// schema for getting leagueID from leagueName
const leagueIDSchema = joi.object().keys({
  leagueName: joi.string().min(2).max(20).required()
});

// schema to get the sport for the league
const getSportSchema =  joi.object().keys({
  leagueID: joi.number().positive().required()
});

// ------  routing  ------

router.use('/results', resultsRoute);
router.use('/fixtures', fixturesRoute);
router.use('/rankings', rankingsRoute);
router.use('/announcements', announcementsRoute);
// all paths are prepended with /league
router.get('/', (req, res) => {
  res.json({
    message: 'league router works'
  });
});

// handle request to check if user is leagueAdmin
router.post('/isLeagueAdmin', async(req, res, next) => {
  await dbSelectLeagueAdmin(req.user.UserID, req.body.LeagueID, (err, result) => {
    if(err) next(err);
    try {
      result[0].LeagueAdmin;
      res.json(result[0]);
    }catch(e) {
      res.json({message: "User is not league Admin"});
    }
  });
});

// handle request to check if user is team admin for any teams in the league
router.post('/isTeamAdmin', async(req, res, next) => {
  await dbSelectTeamAdminsInLeague(req.body.LeagueID, req.user.UserID, (err, result) => {
    if(err) next(err);
    try {
      result[0].TeamAdmin;
      res.json(result[0]);
    } catch(e) {
      re.json({message: "User is not the team admin for a team in the league"});
    }
  });
});

// handle get leagueID from leagueName request
router.post('/leagueID', async(req, res, next) => {
  const result  = joi.validate(req.body, leagueIDSchema);
  if(result.error === null) {
    var players  = await dbSelectLeagueID(req.body.leagueName, async function(err, result){
      if(err) next(err);
      try{
        result[0].leagueID;
        res.json({result});
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else{
    invalidInput(res, next);
  }
});

// get sport from leagueID
router.post('/sport', async(req, res, next) => {
  const result = joi.validate(req.body, getSportSchema);
  if(result.error == null) {
    await dbSelectLeagueSport(req.body.leagueID, async(err, result) => {
      if(err) next(err);
      try{
        result[0].Sport;
        res.json({result});
      } catch(e) {
        invalidInput(res, next);
      }
    });
  } else {
    invalidInput(res, next);
  }
});

// handle create league request
router.post('/create',async (req, res, next) => {
  console.log(req.body.leagueName)
  var leagueName = req.body.leagueName;
  var Sport = req.body.Sport;
  // get leagueadmin from user making request based on their jwt
  var leagueAdmin = req.user.UserID;
  var maxTeams = req.body.maxTeams;
  var loss = req.body.loss;
  var draw = req.body.draw;
  var win = req.body.win;
  var games = req.body.games;
  var city = req.body.city;
  var county = req.body.county;
  var country = req.body.country;

  const result = joi.validate(req.body, leagueSchema);
  if(result.error === null) {
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

// find all league for a sport, city, county, country
router.post('/find', async (req, res, next) => {
  var city = req.body.city;
  var county = req.body.county;
  var country = req.body.country;
  var sport = req.body.sport;

  const result = joi.validate(req.body, findLeagueSchema);
  if(result.error === null) {
    var league = await dbSelectLeagues(city, county, country, sport,  async (err, result) => {
      if(err) next(err);
      try{
        if(result[0] != null) {
            res.json(result);
        } else {
          res.status(422);
          var error = new Error('No leagues found');
          next(error);
        }

      } catch(e) {
        res.status(422);
        var error = new Error('No leagues found');
        next(error);
      }
    })
  } else{
    next(result.error);
  }
});

// get leagues user plays in
router.post('/playsIn', async (req, res, next) => {
  var userID = req.user.UserID;

  var leagues = await dbSelectLeaguesPlayIn(userID, async function(err, result) {
    if(err) next(err);
    try {
      result[0].leagueName;
      res.json({result});
    } catch(e) {
      res.json({message: "no leagues"});
    }
  });
});



// create/format response for invalid inputs
function invalidInput(res, next) {
  res.status(409);
  var error = new Error("Invlaid Input");
  next(error);
}


module.exports = router;
