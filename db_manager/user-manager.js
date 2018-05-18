// model
const User = require('../models/user');

function checkUsername(str) {
	let validUsername = /^[0-9a-zA-Z]+$/g;
 	return str.match(validUsername) ? true : false;
}

module.exports = {
	signUp: function(newUser) {
		return new Promise((resolve) => {
			let error = '';
			// check valid
			if (!checkUsername(newUser.username)) {
				error = `Invalid username<${ newUser.username }>`;
				return resolve({error});
			}
			// format username
			newUser.username = newUser.username.toLowerCase().replace(/\s+/g, '');
			// check username in database
			User.findOne({username: newUser.username}, (err, user) => {
				if (err || user) {
					if (err) error = err;
					if (user) error = `This username <${ newUser.username }> is already taken`;
					return resolve({error: error});
				}
				// create new user
				new User(newUser).save((error, user) => {
					resolve({error, user});
				});
			});
		});
	},
	findOne: async function(username) {
		return new Promise((resolve) => 
			User.findOne({username}, (error, user) => {
				resolve({error, user});
		}));
	}
}