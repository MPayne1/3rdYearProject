// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


const dbSelectUsersTeamAnnouncements = require('../db/select/Users/selectUsersTeamAnnouncements.js');
const dbSelectUsersLeagueAnnouncements = require('../db/select/Users/selectUsersLeagueAnnouncements.js');
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
      res.json({message: "No team announcements"});
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
      res.json({message: "No league announcements"});
    }
  });
});


module.exports = router;
