const express = require('express');
const router = express.Router();

// config
const passport = require('../config/passport');

// var User = require('../models/user');
const userManager = require('../db_manager/user-manager');
const groupsPage = 'groups';

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
	if (!result.error) {
		req.flash('signupMsg', result.error);
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

router.post('/findUser', (req, res) => {
	let username = req.body.username;
	let result = userManager.findUser(username);
	res.send(result);
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
