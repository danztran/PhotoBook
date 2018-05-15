// model
var User = require('../models/user');

function checkUsername(str) {
	let validUsername = /^[0-9a-zA-Z]+$/g;
 	return str.match(validUsername) ? true : false;
}

module.exports.signUp = function (newUser) {
	let done = false;
	let msg = '';
	// check valid
	if (!checkUsername(newUser.username)) {
		msg = 'Invalid username';
	} else {
		// format username
		newUser.username = newUser.username.toLowerCase().replace(/\s+/g, '');
		// check username in database
		User.findOne({username: newUser.username}, (err, user) => {
			if (err || user) {
				if (err) msg = err;
				if (user) msg = 'This username is already taken';
			} else {
				// create new user
				new User(newUser).save((err, user) => {
					if (err) {
						msg = err;
					} else {
						done = true;
						msg = 'Created new user ' + user.username;
					}
				});
			}
		});
	}
	return {done: done, msg: msg};
}