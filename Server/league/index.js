// Handles the backend of the league

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// all paths are prepended with /league
router.get('/', (req, res) => {
  res.json({
    message: 'league router works'
  });
});


module.exports = router;
