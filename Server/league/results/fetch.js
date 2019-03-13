// handle requests to get the result

// require in modules
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const joi = require('joi');


// all paths are prepended with /league/rankings/fetch
router.get('/', (req, res) => {
  res.json({
    message: 'results fetch router works'
  });
});

// route to get football results
router.post('/football', async (req, res, next) => {

});


module.exports = router;
