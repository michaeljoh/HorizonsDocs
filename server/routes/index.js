const express = require('express');
const router = express.Router();

var { User, Document } = require('../models/models');

router.use(function (req, res, next) {
  //TESTING

  if (!req.user) {
    res.json({
      notAuthenticated: true
    });
  } else {
    return next();
  }
});

router.get("/document/:id", function (req, res) {
  if (!req.user) {
    res.json({redirect: "/login"})
  }
})

router.post("/document/:id", function (req, res) {
  new Document({
    owner: req.user._id,
    editorState: {
      myState: req.body.editorState
    }
  }).save(function (err, doc) {
    if (err) res.json({ error: err })
    else {
      res.json({ success: true })
    }
  });
})

module.exports = router;
