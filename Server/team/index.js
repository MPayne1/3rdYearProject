// handle all team requests

// require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// all paths are prepended with /team
router.get('/', (req, res) => {
  res.json({
    message: 'team router works'
  });
});


module.exports = router;
