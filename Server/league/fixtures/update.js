// Handles the backend of updating league fixtures

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

const email = require('../../email/index.js');
// ------  db operations  ------

const dbSelectUpdateFixtureAdmin = require('../../db/select/Fixture/selectUpdateFixtureAdmin.js');
const dbUpdateFixtureInfo = require('../../db/update/updateFixtureInfo.js');
const dbSelectUpcomingFixtures = require('../../db/select/Fixture/selectUpcomingFixtures.js');
const dbSelectLeagueAdmin = require('../../db/select/League/selectLeagueAdmin.js');
const dbSelectTeamsInLeague = require('../../db/select/League/selectTeamsInLeague.js');
const dbUpdateSeasonFinished = require('../../db/update/updateFinishPreviousSeason.js');
const dbInsertSelectNewSeason = require('../../db/insert/insertSelectNewSeason.js');
const dbInsertFixture = require('../../db/insert/insertFixture.js');
const dbSelectSportFromSeasonID = require('../../db/select/selectSportFromSeasonID.js');
const dbInsertFootballRanking = require('../../db/insert/rankings/insertFootballRankings.js');
const dbInsertTennisRanking = require('../../db/insert/rankings/insertTennisRankings.js');
const dbInsertRugbyRanking = require('../../db/insert/rankings/insertRugbyRankings.js');
const dbInsertAmericanFootballRanking = require('../../db/insert/rankings/insertAmericanFootballRankings.js');
const dbInsertHockeyRanking = require('../../db/insert/rankings/insertHockeyRankings.js');
const dbInsertTableTennisRanking = require('../../db/insert/rankings/insertTableTennisRankings.js');
const dbInsertVolleyballRanking = require('../../db/insert/rankings/insertVolleyballRankings.js');
const dbInsertBasketballRanking = require('../../db/insert/rankings/insertBasketballRankings.js');
const dbInsertCricketRanking = require('../../db/insert/rankings/insertCricketRankings.js');
const dbSelectFixturePlayers = require('../../db/select/Fixture/selectFixturePlayers.js');
const dbSelectFixtureTeams = require('../../db/select/Fixture/selectFixtureTeams.js');



// ------  schemas  ------

// schema for updating date/location of fixture
const updateFixtureSchema = joi.object().keys({
  fixtureID: joi.number().positive().required(),
  date: joi.string().min(2).max(30).required(),
  startTime: joi.string().min(2).max(12).required(),
  endTime: joi.string().min(2).max(12).required(),
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
  var date = req.body.date;
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
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
        var update = await dbUpdateFixtureInfo(fixtureID, date, startTime, endTime, address, city, county, postcode);

        // get team members of teams
        await dbSelectFixturePlayers(fixtureID, async (err, playerRes) => {
          if(err) next(err);
          try{
            var players = playerRes;
            await dbSelectFixtureTeams(fixtureID, async (er, teamResult) => {
              if(er) next(er);
              try {
                var teams = teamResult;
                console.log(teams);
                //send email to users
                for(j = 0; j < players.length; j++) {
                  await email.sendFixtureUpdated(players[j].Email,
                    players[j].FirstName, players[j].LastName, teams[0].TeamName,
                    teams[1].TeamName, date, startTime, endTime,address, city, county, postcode,
                    (err, mail) => {
                      if(err) next(err);
                      console.log(mail);
                  });
                }
                res.json(req.body);
              } catch(e){
                next(e);
              }
            })
          } catch(e) {
            next(e);
          }
        });
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
      var teams = await dbSelectTeamsInLeague(leagueID, async function(err, teamList) {
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

                await generateFixtures(teamList, seasonID, leagueID, async (fixtures) => {
                  // then insert fixtures into db, for each time the teams play each other
                  for(i = 0; i < numTimes; i++) {
                    for(j = 0; j < fixtures.length; j++) {
                      await dbInsertFixture(seasonID, fixtures[j].HomeTeamID, fixtures[j].AwayTeamID);
                    }
                  }
                  await initialiseRankingsTable(seasonID, teamList);
                  console.log(fixtures);
                  res.json(fixtures);
                });

              } catch(e) {
                console.log("fixtures error");
                next(e);
              }
            });
        } catch(e) {
          if (e) next(e);
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

  if(teamList.length % 2 == 1) {
    teamList.push({teamID: 1});
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

  // if any teams are playing the bye team, se them to "play" themselves
  for(k = 0; k < fixtures.length; k++) {
    if(fixtures[k].HomeTeamID == 1) {
      fixtures[k].HomeTeamID = fixtures[k].AwayTeamID;
    }
    if(fixtures[k].AwayTeamID == 1) {
      fixtures[k].AwayTeamID = fixtures[k].HomeTeamID;
    }
  }
  callback(fixtures);
}

async function initialiseRankingsTable(seasonID, teams) {
  // get sport from seasonID
  await dbSelectSportFromSeasonID(seasonID, async (err, sport) => {
    if(err) next(err);
    try{
      sport[0];
      console.log(teams);
      // for each team in teams, insert into rankings , all 0s
      switch(sport[0].sport) {
        case "Football":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertFootballRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "Tennis":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertTennisRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "Rugby":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertRugbyRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "American Football":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertAmericanFootballRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "Hockey":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertHockeyRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "Table Tennis":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertTableTennisRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "Volleyball":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertVolleyballRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "Basketball":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertBasketballRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0);
          }
          break;
        case "Cricket":
          for(i = 0; i< teams.length; i++) {
            //initialise everythink to 0
            await dbInsertCricketRanking(seasonID, teams[i].teamID,0,0,0,0,0,0,0,0,0);
          }
          break;
        default:
          console.log("sport not recognised");
      }


    } catch(e) {
      next(e);
    }
  });
}

module.exports = router;
