// Handles the backend of the league

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const dbSelectLeagueNames = require('../db/selectLeagueNames.js');
const dbInsert = require('../db/createLeague.js');


const leagueSchema = joi.object().keys({
  leagueName: joi.string().min(2).max(20).required(),
  leagueAdmin: joi.number().positive().required(),
  Sport: joi.string().regex(/^[a-zA-Z]{3,30}$/).max(30).required(),
  maxTeams: joi.number().positive().required(),
  loss: joi.number().min(0).required(),
  draw: joi.number().positive().required(),
  win: joi.number().positive().required()
});

// all paths are prepended with /league
router.get('/', (req, res) => {
  res.json({
    message: 'league router works'
  });
});


// handle create league request
router.post('/create',async (req, res, next) => {
  console.log(req.body.leagueName)
  var leagueName = req.body.leagueName;
  var Sport = req.body.Sport;
  var leagueAdmin = req.body.leagueAdmin;
  var maxTeams = req.body.maxTeams;
  var loss = req.body.loss;
  var draw = req.body.draw;
  var win = req.body.win;

  const result = joi.validate(req.body, leagueSchema);
  if(result.error == null) {
    var league = await dbSelectLeagueNames(leagueName, async function(err, result){
      if(err) next(err);
      try{
        result[0].leagueName;
        var error = new Error("That league name is taken please choose another");
        res.status(409);
        next(error);
      } catch(e) {
          await dbInsert(leagueName, leagueAdmin, Sport, maxTeams, loss, draw, win);
        res.json(req.body);
      }
    })
  } else{
    res.status(422); // status code for not processable input
    next(result.error); // forwards error to errorHandler
  }
});

module.exports = router;
