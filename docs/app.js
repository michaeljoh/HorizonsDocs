var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models/models');
var routes = require('./routes/index');
var auth = require('./routes/auth');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var _ = require('underscore');
var crypto = require('crypto');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Passport stuff here

// Session info here
app.use(
  session({
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    name: 'Doggos',
    proxy: true,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// function to turn password into hashed password
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Initialize Passport
passport.use(
  new LocalStrategy(function(email, password, done) {
    var hashedPassword = hashPassword(password);
    models.User.findOne({ email: email }, function(err, user) {
      if (err) {
        console.log('Incorrect Email');
        done(err);
      } else if (user && user.password === hashedPassword) {
        console.log('User found!');
        done(null, user);
      } else {
        console.log('Incorrect Password');
        done(null, false);
      }
    });
  })
);

// Passport Serialize
passport.serializeUser(function(user, done) {
  console.log("Hi i'm in serialize");
  done(null, user._id);
});

// Passport Deserialize
passport.deserializeUser(function(id, done) {
  console.log("Hi i'm in deserialize", id);
  models.User.findById(id, function(err, user) {
    console.log(user);
    done(err, user);
  });
});

// Passport Strategy
app.use('/', auth(passport, hashPassword));
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
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
