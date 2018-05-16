// model
var Member = require('../models/member');
var groupManager = require('../db_manager/group-manager');
var userManager = require('../db_manager/user-manager');

var memberManager = {
	create: function(username, code) {
		return new Promise((resolve) => {
			let member = {
				username: username,
				groupCode: code
			}
			new Member(member).save((error, member)=> {
				resolve({error, member});
			});
		});
	},
	add: function(username, addedUsername, groupCode) {
		return new Promise(async (resolve) => {
			// check if member is exists or group&addedUser are null
			let grouprs = await groupManager.findOne(groupCode);
			let addedUserrs = await userManager.findOne(addedUsername);
			let memrs = await matchedMember(username, groupCode);
			if (grouprs.group && addedUserrs.user && !memrs.member) {
				// if group, user exist and member is not
				resolve(await this.create(addedUsername, groupCode));
			} else {
				if (grouprs.error) error = grouprs.error;
				if (addedUsername.error) error = addedUsername.error;
				if (memrs.member) error = "Douplicate Member's data: " + username + " - " + groupCode;
				resolve({error});
			}
		});
	},
	findAllOf: function(username) {
		return new Promise((resolve) => {
			let groups = [];
			Member.find({username: username}, (err, groups) => {
				if (err) return resolve({error: err});
				groups.forEach(async (val) => {
					let grouprs = await groupManager.findOne(val.groupCode);
					if (grouprs.error) return resolve({error:grouprs.error});
					if (grouprs.group) val.name = grouprs.name;
				});
				resolve({groups});
			});
		});
	},
	findOne: function(username, groupCode) {
		return new Promise((resolve) => {
			let query = {username, groupCode};
			Member.findOne(query, (error, member) => {
				if (err) return resolve({error});
				else resolve({member});
			});
		});
	}
}

// fully check member isExist ?
function matchedMember(username, groupCode) {
	return new Promise((resolve) => {
		let query = {username, groupCode};
		Member.findOne(query, (error, member) => {
			if (err) return resolve({error});
			else resolve({member});
		});
	});
}

function isObjectEmpty(obj) {
	return Object.keys(obj).length === 0;
}

module.exports = memberManager;