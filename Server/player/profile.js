// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');
const changeInfo = require('./changeInfo.js');

// ------  schemas  ------



// ------  routing  ------

// all paths are prepended with /player/profile
router.get('/', (req, res) => {
  res.json({
    message: 'player profile router works'
  });
});

router.use('/changeInfo', changeInfo);
module.exports = router;
