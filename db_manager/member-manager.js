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
			new Member(member).save((err, mem)=> {
				resolve({error: err, member: mem});
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
				resolve(await memberManager.create(addedUsername, groupCode));
			} else {
				let error = "";
				if (grouprs.error) error += grouprs.error;
				if (addedUsername.error) error += addedUsername.error;
				if (memrs.member) error += "Douplicate Member's data: " + username + " - " + groupCode;
				resolve({error: error});
			}
		});
	}
}

// fully check member isExist ?
function matchedMember(username, groupCode) {
	return new Promise((resolve) => {
		let query = {
			username: username, 
			groupCode: groupCode
		}
		Member.findOne(query, (err, member) => {
			resolve({
				error: err,
				member: member
			});
		});
	});
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = memberManager;