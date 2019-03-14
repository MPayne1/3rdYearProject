// Handles the backend of team's results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'team results router works'
  });
});


module.exports = router;
