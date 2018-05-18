// model
var Group = require('../models/group');

// db_manager
var userManager = require('./user-manager');

function checkGroupname(str) {
	let validGroupname = /^[0-9a-zA-Z]+$/g;
	return str.match(validGroupname) ? true : false;
}

module.exports = {
	create: function(userId, name, code) {
		return new Promise(async (resolve, reject) => {
			let error = '';
			// check valid
			if (!checkGroupname(code)) 
				return resolve({error: "Invalid group code <"+code+">"});

			// format code
			code = code.replace(/\s+/g, '');

			// check code in database
			let query = await this.findOne(code);
			if (query.error || query.group) {
				if (query.error) error = query.error;
				if (query.group) error = 'This group code <'+code+'> is already taken';
				return resolve({error});
			}			

			// create new group
			let newGroup = {
				name: name,
				code: code,
				date: Date.now(),
				members: [userId]
			}
			await new Group(newGroup).save((error, group) => {
				if (error) return resolve({error});
				group.populate('members', (error) => {
					if (error) return resolve({error});
					resolve({error, group});
				});
			});


		});
	},
	findOne: function(groupCode) {
		return new Promise((resolve) => {
			Group.findOne({code: groupCode})
			.populate('members').populate('photos')
			.exec()
			.then((group, error) => {
				resolve({group, error});
			});
		});
	},
	findAllOf: function(userId) {
		return new Promise(resolve => {
			Group.find({members: userId})
			.populate('members').populate('photos')
			.exec()
			.then((groups, error) => {
				resolve({error, groups});
			});
		});
	},
	addMember: function(userId, username, groupCode) {
		return new Promise(async (resolve) => {

			// check if group is exist
			let groupQuery = await this.findOne(groupCode);
			if ( groupQuery.error) return resolve({error: groupQuery.error});
			if (!groupQuery.group) return resolve({error: "Group<"+ groupCode +"> not found"});
			let group = groupQuery.group;

			// check if adding user is exist
			let userQuery = await userManager.findOne(username);
			if (userQuery.error) return resolve({error: userQuery.error});
			if (!userQuery.user) return resolve({error: "User<"+ username +"> not found"});
			let adduser = userQuery.user;

			// check if adding user is already in group
			if (group.members.some(val => val._id.toString() == adduser._id.toString()))
				return resolve({error: "User is already in group<"+ groupCode +">"});

			// check if current user is a member of group
			if (!group.members.some(val => val._id.toString() == userId.toString()))
				return resolve({error: "You are not a member of this group<"+ groupCode +">"});
			

			// else add user to group
			Group.findByIdAndUpdate(
				group._id, 
				{ $push: { members: adduser._id  } },
				(error, updatedGroup) => resolve({error, group: updatedGroup})
			);
		});
	},
	addPhoto: function(req) {
		return new Promise(async (resolve) => {
			let groupCode = req.params.groupCode;

			// check if group is exist
			let query = await groupManager.findOne(groupCode);
			if ( query.error) return resolve({error: query.error});
			if (!query.group) return resolve({error: "Group<"+ groupCode +"> not found"});
			let group = query.group;

			// check if current user is a member of group
			if (!group.members.some(val => val._id.toString() == userId.toString()))
				return resolve({error: "You are not a member of this group<"+ groupCode +">"});

			// ELSE push photo
			// get info
			let image = req.files.image;
			if (image) imageSrc = await imgur.upload(image.filename); // upload to imgur
			let date = req.body.date ? new Date(req.body.date) : Date.now();
			let photo = {
				author: req.user._id,
				title: req.body.title,
				source: imageSrc,
				date: date
			}
			// push photo and save
			groupManager.findByIdAndUpdate(
				group._id,
				{ $push: { photos: photo } },
				(error) => resolve({error, photo})
			);
		});
	}
}