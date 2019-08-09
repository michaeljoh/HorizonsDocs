const express = require('express');
const router = express.Router();

var { User, Document } = require('../models/models');

router.use(function (req, res, next) {
  if (!req.user) {
    res.json({
      notAuthenticated: true
    });
  } else {
    return next();
  }
});

router.get("/documents", async function (req, res) {
  try {
    let docs = await Document.find({ owner: req.user._id });
    console.log("Userdocs FETCH: ", docs)
    res.json(docs);
  } catch{
    console.log("Error fetching user")
  }
})

router.get("/document/:id", async function (req, res) {
  try {
    let doc = await Document.findById(req.params.id);
    if (!doc) {
      throw "Error fetching doc"
    }
    res.json(doc);
  } catch{
    console.log("Error fetching doc")
    res.json({ redirect: "/portal" })
  }
})

// Return success true and id of new doc
router.post("/newDoc", async function (req, res) {
  let newDoc = {
    owner: req.user._id,
    content: req.body.content,
  }
  if (req.body.title) {
    newDoc.title = req.body.title;
  }
  new Document(newDoc).save(function (err, doc) {
    if (err) res.json({ error: err })
    else {
      res.json({ success: true, id: doc._id })
    }
  });
})

// Save document
router.post("/document", async function (req, res) {
  const doc = await Document.findById(req.body.id);

  if (!doc) {
    let newDoc = {
      owner: req.user._id,
      content: req.body.content,
      lastUpdated: new Date()

    }
    if (req.body.title) {
      newDoc.title = req.body.title;
    }
    new Document(newDoc).save(function (err, doc) {
      if (err) res.json({ error: err })
      else {
        res.json({ success: true })
      }
    });
  }
  else {
    doc.content = req.body.content;
    doc.lastUpdated = new Date();
    if (req.body.title)
      doc.title = req.body.title;
    await doc.save();
  }
})

module.exports = router;
