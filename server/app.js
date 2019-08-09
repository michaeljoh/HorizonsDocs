var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models/models');
var routes = require('./routes/index');
var auth = require('./routes/auth');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var _ = require('lodash');
const cors = require("cors")

var app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

// view engine setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session info here
app.use(session({
  secret: process.env.SECRET,
  name: "CookieMon",
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

// Passport Serialize
passport.serializeUser(function (user, done) {
  done(null, user._id);
})
// Passport Deserialize
passport.deserializeUser(function (id, done) {
  models.User.findById(id, function (err, user) {
    done(err, user);
  })
})

// Passport Strategy
passport.use(new LocalStrategy({ 
  usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
  passwordField: 'password'
}, function (email, password, done) {
  console.log("in strategy")
  models.User.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      done(err);
    }
    else if (!user) {
      console.log("NO USER FOUND")
      done(null, false, { message: "incorrect email" });
    }
    else if (user.password !== password) {
      console.log("PASSWORDS DONT MATCH")

      done(null, false, { message: "incorrect password" });
    }
    else {
      done(null, user);
    }
  })
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
