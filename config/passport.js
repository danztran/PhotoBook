// load all the things we need
const LocalStrategy     = require('passport-local').Strategy;
const passport          = require('passport');

// my modules
// const checkLetter	    = require('../my_modules/checkText');

// load up the user model
var User                = require('../models/user');

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
   done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ 'username': username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password !== password) { return done(null, false); }
      return done(null, user);
    });
  }
));

// expose this function to our app using module.exports
module.exports = passport;