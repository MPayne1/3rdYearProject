// Handles the backend of the league

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const resultsRoute = require('./results/index.js');
// db operations
const dbSelectLeagueNames = require('../db/selectLeagueNames.js');
const dbInsert = require('../db/createLeague.js');
const dbSelectLeagues = require('../db/selectLeagueFromCity.js');
const dbSelectLeagueAdmin = require('../db/selectLeagueAdmin.js');
const dbSelectTeamsInLeague = require('../db/selectTeamsInLeague.js');
const dbInsertSelectNewSeason = require('../db/insertSelectNewSeason.js');
const dbInsertFixture = require('../db/insertFixture.js');
const dbSelectLeaguesPlayIn = require('../db/selectLeaguesPlayIn.js');
const dbSelectUpcomingFixtures = require('../db/selectUpcomingFixtures.js');
const dbSelectLeagueID = require('../db/selectLeagueID.js');
const dbSelectUpdateFixtureAdmin = require('../db/selectUpdateFixtureAdmin.js');
const dbUpdateFixtureInfo = require('../db/updateFixtureInfo.js');

//------  schemas  ------

// schema for input validation
const leagueSchema = joi.object().keys({
  leagueName: joi.string().min(2).max(20).required(),
  leagueAdmin: joi.number().positive().required(),
  Sport: joi.string().regex(/^[a-zA-Z]{3,30}$/).max(30).required(),
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

// schema for updating date/location of fixture
const updateFixtureSchema = joi.object().keys({
  fixtureID: joi.number().positive().required(),
  date: joi.string().min(2).max(30).required(),
  address: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  city: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  county: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  postcode: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
});

// both startSeason and upcoming fixtures schema
const startSeasonSchema = joi.object().keys({
  leagueID: joi.number().positive().required()
});

// schema for getting leagueID from leagueName
const leagueIDSchema = joi.object().keys({
  leagueName: joi.string().min(2).max(20).required()
});

router.use('/results', resultsRoute);

// all paths are prepended with /league
router.get('/', (req, res) => {
  res.json({
    message: 'league router works'
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


// handle request for all upcoming fixtures in a league
router.post('/upcomingFixtures', async (req, res, next) => {
  var userID = req.user.UserID;
  var leagueID = req.body.leagueID
  const result = joi.validate(req.body, startSeasonSchema);
  if(result.error === null) {
    var fixtures = await dbSelectUpcomingFixtures(leagueID, async function(err, result) {
      if(err) next(err);
      try {
        result[0].fixtureID;
        res.json({result});
      } catch(e) {
        res.json({message: "no upcoming fixtures"});
      }
    });
  }  else{
    next(result.error);
  }

});

// handle req for updatingfixture info
router.post('/updateFixture', async (req, res, next) => {
  var userID = req.user.UserID;
  var fixtureID  = req.body.fixtureID;
  // format date for adding to db
  var date = req.body.date.slice(0,-3);
  var address  = req.body.address;
  var city = req.body.city;
  var county = req.body.county;
  var postcode = req.body.postcode;

  const result = joi.validate(req.body, updateFixtureSchema);
  if(result.error === null) {
    // check user is captain of one of the teams or the league admin
    var admin = await dbSelectUpdateFixtureAdmin(userID, fixtureID, async function(err, result) {
      if(err) next(err);
      // if result doesn't have league/team Admin then user can't update fixture
      try {
        result[0].leagueAdmin;
        // if user is allowed, update the fixture info
        var update = await dbUpdateFixtureInfo(fixtureID, date, address, city, county, postcode);
        res.json(req.body);
      } catch(e) {
        var error = new Error("Only league admins and team captains can update fixture information");
        res.status(403);
        next(error);
      }
    });

  } else {
    next(result.error);
  }
});


// generate the fixtures at start of season
router.post('/startSeason', async(req, res, next) => {
  var leagueID = req.body.leagueID;
  var leagueAdmin = req.user.UserID;
  var seasonID = '';
  var numTimes = '';

const result = joi.validate(req.body, startSeasonSchema);
if(result.error === null) {

  // check user is leagueAdmin, also get the no.of times each team plays each other
  var admin = await dbSelectLeagueAdmin(leagueAdmin, leagueID, async function(err, result) {
    if(err) next(err);
    try {
      result[0].LeagueAdmin;
      numTimes = result[0].games;
      // get list of teams in league
      var teams = await dbSelectTeamsInLeague(leagueID, async function(err, result) {
        if(err) next(err);
        try {
          result[0];

          // insert new season into season table, also getting the seasonID jsut created
          var season = await dbInsertSelectNewSeason(leagueID, async function(er, result2) {
            if(er) next(er);
            try{
              seasonID = result2[result2.length-1].seasonID;

              await generateFixtures(result, seasonID, leagueID, async (fixtures) => {
                // then insert fixtures into db, for each time the teams play each other
                for(i = 0; i < numTimes; i++) {
                  for(j = 0; j < fixtures.length; j++) {
                    await dbInsertFixture(leagueID, seasonID, fixtures[j].HomeTeamID, fixtures[j].AwayTeamID);
                  }
                }
                console.log(fixtures);
                res.json(fixtures);
              });
            } catch(e) {
              next(e);
            }
          });
        } catch(e) {
          var error = new Error("No teams in the league yet.");
          res.status(422);
          next(error);
        }
      });
    } catch(e) {
      var error = new Error("Only the League Admin can start a new season");
      res.status(403);
      next(error);
    }
  });


 } else {
  next(result.error);
 }
});


/*
fixture = {
  leageID: '',
  seasonID: '',
  HomeTeam: '',
  AwayTema: '',
}
*/
// generate a list of fixtures, each team plays each other once
function generateFixtures(teamList, seasonID, leagueID, callback) {

  var fixtures = [];
  // add a Bye team if odd no of teams
  if(teamList.length % 2 == 1) {
    teamList.push({teamID: 0});
  }
  var numTeams = teamList.length;

// for each round/matchday
for(j = 0; j < numTeams-1; j++) {
  // for each home team
  for(i = 0; i < numTeams / 2; i++) {
    // insert teams as a fixture
    fixtures.push({
      leagueID: leagueID,
      seasonID: seasonID,
      HomeTeamID: teamList[i].teamID,
      AwayTeamID: teamList[numTeams-1-i].teamID});
  }
  teamList.splice(1,0, teamList.pop());
}
  callback(fixtures);
}

// create/format response for invalid inputs
function invalidInput(res, next) {
  res.status(409);
  var error = new Error("Invlaid Input");
  next(error);
}




module.exports = router;
