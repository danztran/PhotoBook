// model
var User = require('../models/user');

function checkUsername(str) {
	let validUsername = /^[0-9a-zA-Z]+$/g;
 	return str.match(validUsername) ? true : false;
}

var userManager = {
	signUp: function(newUser) {
		return new Promise((resolve) => {
			let error = '';
			// check valid
			if (!checkUsername(newUser.username)) {
				error = 'Invalid username';
				resolve({error: error});
			} else {
				// format username
				newUser.username = newUser.username.toLowerCase().replace(/\s+/g, '');
				// check username in database
				User.findOne({username: newUser.username}, async (err, user) => {
					if (err || user) {
						if (err) error = err;
						if (user) error = 'This username is already taken';
						resolve({error: error});
					} else {
						// create new user
						new User(newUser).save((err, user) => {
							if (err) error = err;
							resolve({error: error, user: user});
						});
					}
				});
			}
		});
	},
	findOne: function(username) {
		return new Promise((resolve) => 
			User.findOne({username: username}, (err, user) => {
				resolve({error: err, user: user});
		}));
	}
}

module.exports = userManager;