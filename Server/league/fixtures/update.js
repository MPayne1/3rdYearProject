// Handles the backend of updating league fixtures

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

// ------  db operations  ------

const dbSelectUpdateFixtureAdmin = require('../../db/select/selectUpdateFixtureAdmin.js');
const dbUpdateFixtureInfo = require('../../db/update/updateFixtureInfo.js');
const dbSelectUpcomingFixtures = require('../../db/select/selectUpcomingFixtures.js');
const dbSelectLeagueAdmin = require('../../db/select/selectLeagueAdmin.js');
const dbSelectTeamsInLeague = require('../../db/select/selectTeamsInLeague.js');
const dbUpdateSeasonFinished = require('../../db/update/updateFinishPreviousSeason.js');
const dbInsertSelectNewSeason = require('../../db/insert/insertSelectNewSeason.js');
const dbInsertFixture = require('../../db/insert/insertFixture.js');

// ------  schemas  ------

// schema for updating date/location of fixture
const updateFixtureSchema = joi.object().keys({
  fixtureID: joi.number().positive().required(),
  date: joi.string().min(2).max(30).required(),
  address: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  city: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  county: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
  postcode: joi.string().regex(/^[\w\-\s]{2,30}$/).required(),
});


// both startSeason/ upcoming fixtures/ sport schema
const startSeasonSchema = joi.object().keys({
  leagueID: joi.number().positive().required()
});

// ------  routing ------

// all paths are prepended with /league/fixtures/update
router.get('/', (req, res) => {
  res.json({
    message: 'fixture update router works'
  });
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

          // set last season finished true
          await dbUpdateSeasonFinished(leagueID, 'true');

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



module.exports = router;