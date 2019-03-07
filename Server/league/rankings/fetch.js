// get the rankings
// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// all paths are prepended with /league/rankings/fetch
router.get('/', (req, res) => {
  res.json({
    message: 'rankings fetch router works'
  });
});


module.exports = router;
