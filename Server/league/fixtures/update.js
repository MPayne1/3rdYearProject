// Handles the backend of updating league fixtures

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// all paths are prepended with /league/fixtures/update
router.get('/', (req, res) => {
  res.json({
    message: 'fixture update router works'
  });
});


module.exports = router;
