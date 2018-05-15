// model
var User = require('../models/user');

function checkUsername(str) {
	let validUsername = /^[0-9a-zA-Z]+$/g;
 	return str.match(validUsername) ? true : false;
}

module.exports = {
	signUp: async function(newUser) {
		let error = '';
		// check valid
		if (!checkUsername(newUser.username)) {
			error = 'Invalid username';
		} else {
			// format username
			newUser.username = newUser.username.toLowerCase().replace(/\s+/g, '');
			// check username in database
			await User.findOne({username: newUser.username}, (err, user) => {
				if (err || user) {
					if (err) error = err;
					if (user) error = 'This username is already taken';
				} else {
					// create new user
					new User(newUser).save((err, user) => {
						if (err) error = err;
					});
				}
			});
		}
		return {error: error, user: newUser};
	},
	findUser: async function(username) {
		let error = '';
		let found = false;
		await User.findOne({username: username}, (err, user) => {
			if (err) error = err;
			else if (user) found = true;
		});
		return {error: error, found: found};
	}
} 