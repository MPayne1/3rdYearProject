// Handles the backend of results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

const fetch = require('./fetch.js');

// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'league rankings router works'
  });
});

router.use('/fetch', fetch);

module.exports = router;
