// model
var Group = require('../models/group');

function checkGroupname(str) {
	let validGroupname = /^[0-9a-zA-Z]+$/g;
 	return str.match(validGroupname) ? true : false;
}

module.exports = {
	create: function(name, code) {
		return new Promise(async (resolve) => {
			let error = '';
			// check valid
			if (!checkGroupname(code)) {
				error = 'Invalid group code';
				resolve({error: error});
			} else {
				// format code
				code = code.replace(/\s+/g, '');
				// check code in database
				await Group.findOne({code: code}, async (err, group) => {
					if (err || group) {
						if (err) error = err;
						if (group) error = 'This group code is already taken';
						resolve({error: error});
					} else {
						let newGroup = {
							name: name,
							code: code,
							date: Date.now()
						}
						// create new group
						await new Group(newGroup).save((err, group) => {
							if (err) {
								error = err;
							}
							resolve({error: error, group: group});
						});
					}
				});
			}
		});
	},
	findOne: function(groupCode) {
		return new Promise((resolve) => 
			Group.findOne({code: groupCode}, (err, group) => {
				resolve({error: err, group: group});
			})
		);
	}
}