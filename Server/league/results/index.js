// Handles the backend of results

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');

const update = require('./update.js');

// all paths are prepended with /league/results
router.get('/', (req, res) => {
  res.json({
    message: 'league results router works'
  });
});

router.use('/update', update);

module.exports = router;
