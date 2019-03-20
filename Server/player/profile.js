// handle all player requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');



// ------  routing  ------

// all paths are prepended with /team
router.get('/', (req, res) => {
  res.json({
    message: 'player profile router works'
  });
});


module.exports = router;
