// Handles the backend of team's announcements

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

const dbSelectCaptain = require('../db/select/selectTeamCaptain.js');
const dbInsertAnnouncement = require('../db/insert/insertTeamAnnouncement.js');
const dbDeleteAnnouncement = require('../db/delete/deleteTeamAnnouncement.js');

// ------  schemas  ------
const newAnnouncementSchema = joi.object().keys({
  message: joi.string().regex(/^[\w\-\s]{0,200}$/).required(),
  TeamID: joi.number().positive().required(),
});

const removeAnnouncementSchema = joi.object().keys({
  AnnouncementID: joi.number().positive().required(),
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

        res.json({message: "Announcement added"});
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
    // remove announcement from db
    await dbDeleteAnnouncement(req.body.AnnouncementID);
    res.json({message: "Announcement deleted."})
  } else {
    next(result.error);
  }

});



module.exports = router;
