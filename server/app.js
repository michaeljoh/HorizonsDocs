var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var auth = require('./routes/auth');

// require node modules here
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/User');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var app = express();

// Passport stuff
app.use(
  session({
    secret: 'keyboard cat',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Tell Passport how to set req.user
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Tell passport how to read our user models
passport.use(
  new LocalStrategy(function(username, password, done) {
    // Find the user with the given username
    User.findOne({ username: username }, function(err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.log(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false);
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false);
      }
      // auth has has succeeded
      return done(null, user);
    });
  })
);

// Uncomment these out after you have implemented passport in step 1

app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

// production error handler
// no stacktraces leaked to user

module.exports = app;
