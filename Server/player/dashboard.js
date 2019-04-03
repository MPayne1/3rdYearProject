// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


const dbSelectUsersTeamAnnouncements = require('../db/select/Users/selectUsersTeamAnnouncements.js');
const dbSelectUsersLeagueAnnouncements = require('../db/select/Users/selectUsersLeagueAnnouncements.js');
const dbSelectUserUpcomingFixtures = require('../db/select/Fixture/selectUpcomingFixturesForUser.js');
const dbSelectUserAwayFixtures = require('../db/select/Fixture/selectUpcomingAwayFixturesForUser.js');
// ------  schemas  ------



// ------  routing  ------

// all paths are prepended with /player/profile
router.get('/', (req, res) => {
  res.json({
    message: 'player dashboard router works'
  });
});


// route to view all a users team announcements
router.post('/TeamAnnouncements', async (req, res, next) => {
  await dbSelectUsersTeamAnnouncements(req.user.UserID, (err, result) => {
    if(err) next(err);
    try {
      result[0].message;
      res.json(result);
    } catch(e) {
      res.json({message: "No team announcements."});
    }
  });
});

// route to view all a users league announcements
router.post('/LeagueAnnouncements', async(req, res, next) => {
  await dbSelectUsersLeagueAnnouncements(req.user.UserID, (err, result) => {
    if(err) next(err);
    try{
      result[0].message;
      res.json(result);
    } catch(e) {
      res.json({message: "No league announcements."});
    }
  });
});

// route to get all a users upcoming fixtures
router.get('/upcomingFixtures', async(req, res, next) => {
  var fixtures;
  await dbSelectUserUpcomingFixtures(req.user.UserID, async(err, result) => {
    if(err) next(err);
      fixtures = result;
      await dbSelectUserAwayFixtures(req.user.UserID, (er, fix) => {
        if(er) next(er);
        try {
          var all = fixtures.concat(fix);
          all[0].fixtureID;
          for(i =0; i< all.length; i++) {
            if(all[i].date == null || all[i].startTime ==null || all[i].endTime == null) {
              throw new Error();
            }
          }
          res.json(all);
        } catch(e) {
          res.json({message: "No upcoming fixtures"});
        }
      });
  });
});

module.exports = router;
