// model
var Member = require('../models/member');
var Group = require('../models/group');
var User = require('../models/user');

module.exports = {
	create: async function(newMember) {
		let error = '';
		// format code
		await User.findOne({username: newMember.username}, (err, user) => {
			if (err) error = err;
			if (!user) error = 'Username not found';
		})
		// check code in database
		await Group.findOne({code: newGroup.code}, (err, group) => {
			if (err) error = err;
			if (!group) error = 'Group not found';
		});

		if (!error) {
			await new Member(newMember).save((err) => {
				if (err) error = err;
			});
		}

		return {error: error, addrs: !error };
	}
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}