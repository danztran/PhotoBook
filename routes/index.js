const express = require('express');
const router = express.Router();

// config
const passport = require('../config/passport');

// var User = require('../models/user');
const userManager = require('../db_manager/user-manager');
const groupsPage = '/groups';

/* GET home page. */
router.get('/', (req, res) => {
	if (!req.user) res.render('index', { title: 'Account | PhotoBook' });
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

router.post('/signup', async (req, res, next) => {
	let newUser = {
		username: req.body.username,
		password: req.body.password
	};
	let result = await userManager.signUp(newUser);
	if (result.error) {
		req.flash('signupMsg', result.error);
		res.redirect('/');
	} else { // if success created account, auto signin
		req.flash('signupMsg', "Account successfully created");
		passport.authenticate('local')(req, res, function () {
            res.redirect(groupsPage);
        });
	}
});

router.get('/signout', (req, res) => {
	req.flash('status', 'You have signed out');
	req.logout();
	res.redirect('/');
});

router.post('/findUser', async (req, res) => {
	let username = req.body.username;
	let result = await userManager.findOne(username);
	if (result.user) {
		result.found = true;
	}
	result.username = username;
	delete result.user;
	res.send(result);
});

module.exports = router;
