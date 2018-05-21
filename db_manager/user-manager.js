// model
const User = require('../models/user');

function checkValid(str) {
	let valid = /^[0-9a-zA-Z]+$/g;
 	return str.match(valid) ? true : false;
}

module.exports = {
	signUp: function(newUser) {
		return new Promise((resolve) => {
			let error = '';
			// check valid
			if (!checkValid(newUser.username)) {
				error = `Invalid username<${ newUser.username }>`;
				return resolve({error});
			}
			if (!checkValid(newUser.password)) {
				error = `Invalid password`;
				return resolve({error});
			}
			// format username
			newUser.username = newUser.username.toLowerCase().replace(/\s+/g, '');
			newUser.password = newUser.password.toLowerCase().replace(/\s+/g, '');
			// check username in database
			User.findOne({username: newUser.username}, (err, user) => {
				if (err || user) {
					if (err) error = err;
					if (user) error = `This username <${ newUser.username }> is already taken`;
					return resolve({error: error});
				}
				// create new user
				new User(newUser).save((error, newuser) => {
					resolve({error, user: newuser});
				});
			});
		});
	},
	checkUser: function(newUser) {
		return new Promise(async (resolve) => {
			// check valid
			if (!checkValid(newUser.username)) {
				let error = `Invalid username<${ newUser.username }>`;
				return resolve({error});
			}
			if (!checkValid(newUser.password)) {
				let error = `Invalid password`;
				return resolve({error});
			}
			// format username
			newUser.username = newUser.username.toLowerCase().replace(/\s+/g, '');
			newUser.password = newUser.password.toLowerCase().replace(/\s+/g, '');
			// check username in database
			let query = this.findOne(newUser.username);
			if (query.error) return resolve({error: query.error});
			if (query.user) return resolve({error: `This username <${ newUser.username }> is already taken`});

			resolve({status: true});

		});
	},
	findOne: async function(username) {
		return new Promise((resolve) => 
			User.findOne({username}, (error, user) => {
				resolve({error, user});
		}));
	}
}