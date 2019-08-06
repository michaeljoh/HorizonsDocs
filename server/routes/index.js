const express = require('express');
const router = express.Router();

var {User} = require('../models/models');

router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

module.exports = router;
