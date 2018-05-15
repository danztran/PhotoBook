// model
var Group = require('../models/group');

function checkGroupname(str) {
	let validGroupname = /^[0-9a-zA-Z]+$/g;
 	return str.match(validGroupname) ? true : false;
}

module.exports = {
	create: async function(newGroup) {
		let error = '';
		// check valid
		if (!checkGroupname(newGroup.code)) {
			error = 'Invalid group code';
		} else {
			// format code
			newGroup.code = newGroup.code.replace(/\s+/g, '');
			// check code in database
			await Group.findOne({code: newGroup.code}, async (err, group) => {
				if (err || gr) {
					if (err) error = err;
					if (gr) error = 'This group code is already taken';
				} else {
					// create new group
					await new Group(newGroup).save((err, group) => {
						if (err) {
							error = err;
						}
					});
				}
			});
		}
		return {error: error, group: newGroup};
	}
}