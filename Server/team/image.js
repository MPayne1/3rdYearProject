// Handles the backend of team's results

// require in modules
const express = require('express');
const router = express.Router();
const joi = require('joi');




// all paths are prepended with /team/image
router.get('/', (req, res) => {
  res.json({
    message: 'team image works'
  });
});



module.exports = router;
