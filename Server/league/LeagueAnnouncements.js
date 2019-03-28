// Handles the backend of league's announcements

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

const email = require('../email/index.js');

const dbSelectLeagueAdmin = require('../db/select/selectLeagueAdmin.js');
const dbInsertAnnouncement = require('../db/insert/insertLeagueAnnouncement.js');
const dbDeleteAnnouncement = require('../db/delete/deleteLeagueAnnouncement.js');
const dbSelectLeagueAnnouncements = require('../db/select/selectLeagueAnnouncements.js');
const dbUserEmailInfo = require('../db/select/selectUserEmailLeagueAnnouncement.js');

// ------  schemas  ------
const newAnnouncementSchema = joi.object().keys({
  message: joi.string().regex(/^[\w\-\s]{0,200}$/).required(),
  LeagueID: joi.number().positive().required(),
});

const removeAnnouncementSchema = joi.object().keys({
  AnnouncementID: joi.number().positive().required(),
  LeagueID: joi.number().positive().required(),
});

const selectAnnouncementsSchema = joi.object().keys({
  LeagueID: joi.number().positive().required(),
});

// ------  routes  ------

// all paths are prepended with /league/announcements
router.get('/', (req, res) => {
  res.json({
    message: 'league announcements router works'
  });
});


// route to add a new leagueAnnouncement
router.post('/new', async(req, res, next) => {
  const result = joi.validate(req.body, newAnnouncementSchema);

  if(result.error === null) {
    // check user is leagueAdmin
    await dbSelectLeagueAdmin(req.user.UserID, req.body.LeagueID, async(err, result) => {
      if(err) next(err);
      try{
        result[0].LeagueAdmin;
        // add announcement to db
        await dbInsertAnnouncement( req.body.LeagueID, req.body.message);

        // get info for all players
        await dbUserEmailInfo(req.body.LeagueID, async (err,userInfo) => {
          if(err) next(err);
          try {
            userInfo[0].email;
            // send email to users in team
            for(i = 0; i < userInfo.length; i++) {
              await email.sendLeagueAnnouncement(userInfo[i].email,
                userInfo[i].firstname, userInfo[i].lastname, userInfo[i].leagueName,
                req.body.message, (err, mail) => {
                    if(err) next(err);
                    console.log(mail);
                });
            }
            res.json({message: "Announcement added"});
          } catch(e) {
            next(e);
          }
        });
      } catch(e) {
        var error = new Error("Only the league Admincan add announcements.");
        res.status(409);
        next(error);
      }
    });
  } else {
    next(result.error);
  }
});

// route to remove a team announcement
router.post('/remove', async(req, res, next) => {
  const result = joi.validate(req.body, removeAnnouncementSchema);

  if(result.error === null) {
    // check user is teamAdmin
    await dbSelectLeagueAdmin(req.user.UserID, req.body.LeagueID, async(err, result) => {
      if(err) next(err);
      try{
        result[0].LeagueAdmin;
        // remove announcement from db
        await dbDeleteAnnouncement(req.body.AnnouncementID);
        res.json({message: "Announcement deleted."})
      } catch(e) {
        var error = new Error("Only the league admin can remove announcements.");
        res.status(409);
        next(error);
      }
    });
  } else {
    next(result.error);
  }
});


// route to select all league announcements for a league
router.post('/selectAll', async(req, res, next) => {
  const result = joi.validate(req.body, selectAnnouncementsSchema);

  if(result.error === null) {
    // get all announcements from db
    await dbSelectLeagueAnnouncements(req.body.LeagueID, (err, result) => {
      if(err) next(err);
      try{
        result[0].message;
        res.json(result);
      } catch(e) {
        var error = new Error("Currently no league announcements");
        res.status(422);
        next(error);
      }
    });
  } else {
    next(result.error);
  }
});




module.exports = router;
