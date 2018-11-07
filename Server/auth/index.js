// require in modules
const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();

// any route in here is pre-prended with /auth

router.get('/', (req, res) => {
  res.json({
    message: 'router works'
  });
});

router.post('/signup', (req, res) => {
  console.log('body', req.body );
  res.json({
    message: 'signed up'
  });
});

module.exports = router;
