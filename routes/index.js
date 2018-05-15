const express = require('express');
const router = express.Router();

// config
const passport = require('../config/passport');

// var User = require('../models/user');
var userManager = require('../db_manager/user-manager');
let groupsPage = 'groups';

/* GET home page. */
router.get('/', (req, res) => {
	if (!req.user) res.render('index', { title: 'PhotoBook' });
	else res.redirect(groupsPage);
});

router.post('/signin',
	passport.authenticate('local', {
		failureFlash: 'Invalid username or password',
		failureRedirect: '/'
	}), function(req, res) {
		res.redirect(groupsPage);
	}
);

router.post('/signup', (req, res, next) => {
	let newUser = {
		username: req.body.username,
		password: req.body.password
	};
	console.log(req.body);
	let result = userManager.signUp(newUser);
	if (!result.done) {
		req.flash('signupMsg', result.msg);
		res.redirect('/');
	} else {
		passport.authenticate('local')(req, res, () => {
			res.redirect(groupsPage);
		});
	}
});

router.get('/signout', (req, res) => {
	req.flash('status', 'You have logged out');
	req.logout();
	res.redirect('/');
});

// function isUser (req, res, next) {
// 	if (req.isAuthenticated()) return next();
// 	res.redirect('/');
// }

// function isVisiter (req, res, next) {
// 	if (!req.isAuthenticated()) return next();
// 	res.redirect('groups');
// }

module.exports = router;
