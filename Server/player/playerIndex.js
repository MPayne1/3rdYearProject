// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

const profile = require('./profile.js');
const dashboard = require('./dashboard.js');
// ------  routing  ------

// all paths are prepended with /player
router.get('/', (req, res) => {
  res.json({
    message: 'player router works'
  });
});

router.use('/profile', profile);
router.use('/dashboard', dashboard);


module.exports = router;
