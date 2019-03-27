// Handles the backend of team's announcements

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// all paths are prepended with /team/announcements
router.get('/', (req, res) => {
  res.json({
    message: 'team announcements router works'
  });
});


module.exports = router;
