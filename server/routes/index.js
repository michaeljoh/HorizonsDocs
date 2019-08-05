var express = require('express');
var router = express.Router();

var User = require('../models/User');

router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

module.exports = router;
