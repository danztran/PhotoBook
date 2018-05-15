const createError 			= require('http-errors');
const express 				  = require('express');
const mongoose 				  = require('mongoose');
// const favicon 				  = require('serve-favicon');
const session 				  = require('express-session');
const path 					    = require('path');
const cookieParser 			= require('cookie-parser');
const passport 		     	= require('passport');
const logger 				    = require('morgan');
const flash 		        = require('connect-flash');

const dbconfig = require('./config/dbconfig.js');

const indexRouter 	= require('./routes/index');
const groupsRouter 	= require('./routes/groups');


// configuration
const port      = process.env.POST || 3000;
mongoose.connect(dbconfig.url);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// using config
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport - session - flash
app.use(session({ 
	secret: 'seeeecccccrrrrreeeet',
	resave: false,
	saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());// use connect-flash for flash messages stored in session

// routes
app.use('/', indexRouter);
app.use('/groups', groupsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
