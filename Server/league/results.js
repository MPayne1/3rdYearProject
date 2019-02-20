// Handles the backend of the league results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'league results router works'
  });
});

module.exports = router;
