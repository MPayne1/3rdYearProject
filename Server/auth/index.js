// require in modules
const express = require('express');
const joi = require('joi');

const router = express.Router();
const schema = joi.object().keys({
  username: joi.string().alphanum().min(2).max(20).required(),
  password: joi.string().min(8).required() // password must be 8 char long
});
// any route in here is pre-prended with /auth

router.get('/', (req, res) => {
  res.json({
    message: 'router works'
  });
});

router.post('/signup', (req, res) => {
  console.log('body', req.body );
  const result = joi.validate(req.body, schema);
  res.json(result);
});

module.exports = router;
