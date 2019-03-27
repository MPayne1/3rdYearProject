// Handles the backend of team's announcements

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

const email = require('../email/index.js');

const dbSelectCaptain = require('../db/select/selectTeamCaptain.js');
const dbInsertAnnouncement = require('../db/insert/insertTeamAnnouncement.js');
const dbDeleteAnnouncement = require('../db/delete/deleteTeamAnnouncement.js');
const dbUserEmailInfo = require('../db/select/selectUserEmailTeamAnnouncement.js');
// ------  schemas  ------
const newAnnouncementSchema = joi.object().keys({
  message: joi.string().regex(/^[\w\-\s]{0,200}$/).required(),
  TeamID: joi.number().positive().required(),
});

const removeAnnouncementSchema = joi.object().keys({
  AnnouncementID: joi.number().positive().required(),
  TeamID: joi.number().positive().required(),
});


// ------  routes  ------

// all paths are prepended with /team/announcements
router.get('/', (req, res) => {
  res.json({
    message: 'team announcements router works'
  });
});


// route to add a new teamAnnouncement
router.post('/new', async(req, res, next) => {
  const result = joi.validate(req.body, newAnnouncementSchema);

  if(result.error === null) {
    // check user is teamAdmin
    await dbSelectCaptain(req.user.UserID, req.body.TeamID, async(err, result) => {
      if(err) next(err);
      try{
        result[0].TeamAdmin;
        // add announcement to db
        await dbInsertAnnouncement( req.body.TeamID, req.body.message);

        // get info for all players
        await dbUserEmailInfo(req.body.TeamID, async (err,userInfo) => {
          if(err) next(err);
          try {
            userInfo[0].email;
            // send email to users in team
            for(i = 0; i < userInfo.length; i++) {
              await email.sendTeamAnnouncement(userInfo[i].email,
                userInfo[i].firstname, userInfo[i].lastname, userInfo[i].teamname,
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
        var error = new Error("Only the team Admin/captain can add announcements.");
        res.status(409);
        next(error);
      }
    });
  } else {
    next(result.error);
  }
});


router.post('/remove', async(req, res, next) => {
  const result = joi.validate(req.body, removeAnnouncementSchema);

  if(result.error === null) {
    // check user is teamAdmin
    await dbSelectCaptain(req.user.UserID, req.body.TeamID, async(err, result) => {
      if(err) next(err);
      try{
        result[0].TeamAdmin;
        // remove announcement from db
        await dbDeleteAnnouncement(req.body.AnnouncementID);
        res.json({message: "Announcement deleted."})
      } catch(e) {
        var error = new Error("Only the team Admin/captain can remove announcements.");
        res.status(409);
        next(error);
      }
    });
  } else {
    next(result.error);
  }
});



module.exports = router;
