const express = require('express');
const router = express.Router();

const { User } = require('../models/models.js');

module.exports = function (passport) {
  // Add Passport-related auth routes here, to the router!

  // POST Login page
  router.post(
    '/login',
    function (req, res, next) {
      passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.json({ success: false }); }

        req.logIn(user, function (err) {
          if (err) { return next(err); }
          return res.json({ success: true, redirect: '/portal' });
        });
      })(req, res, next)
    }
  );

  // Add unique email check
  const validateReq = async function (userData) {
    if (!userData.email) {
      return 'Please enter a username.';
    }
    if (!userData.password) {
      return 'Please enter a password.';
    }

    const user = await User.findOne({email: userData.email});
    if (user)
      return "User already exists";
  };

  // POST registration 
  router.post('/signup', async function (req, res) {
    // validation step
    let error = await validateReq(req.body);
    if (error) {
      return res.send(`Signup error: ${error}`);
    }

    let u = new User({
      email: req.body.email,
      password: req.body.password,
      name: {
        first: req.body.name.first,
        last: req.body.name.last
      }
    });

    u.save(function (err, user) {
      if (err) {
        res.send('Error signing up');
      }
      console.log('Saved User: ', user);
      res.send('User successfully created');
    });
  });

  router.get('/logout', function (req, res) {
    req.logout();
    console.log("Logging out...")
    res.json({success: true, redirect: "/login"});
  });

  return router;
};
