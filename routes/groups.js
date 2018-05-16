const express 		= require('express');
const router 		= express.Router();

var imgMulter		= require('../config/multer').img;
var imgur 			= require('../config/imgur');

const groupManager 	= require('../db_manager/group-manager');
const memberManager = require('../db_manager/member-manager');
const photoManager 	= require('../db_manager/photo-manager.js');

router.get('/', async (req, res) => {
	if (!req.user) return res.redirect('../');
	let username = req.user.username;
	let groups = [];
	result = await memberManager.findAllOf(username);
	if (result.error != 'null' && result.error) req.flash('queryError', result.error);
	console.log(result);
	res.render('groups', { 
		title: 'Groups | PhotoBook', 
		groups: result.groups,
		user: req.user
	});
});

router.post('/create', async (req, res) => {
	if (!req.user) return res.redirect('../');
	name = req.body.groupName;
	code = req.body.groupCode;
	let result = await groupManager.create(name, code);
	let memrs = {};
	// if success create group
	// create member (add user + group)
	if (result.group) memrs = await memberManager.create(req.user.username, code);
	if (!memrs.error) return res.send(result);
	return res.send(memrs);
});

router.post('/addMember', async (req, res) => {
	if (!req.user) return res.redirect('../');
	let username = req.body.username;
	let groupCode = req.body.groupCode;
	let result = await memberManager.add(req.user.username, username, groupCode);
	res.send(result);
});

router.get('/:groupCode', async (req, res) => {
	if (!req.user) return res.redirect('../');
	let groupCode = req.query.groupCode;
	let memberrs = {};
	let grouprs = {};
	let photosrs = {};
	if (groupCode) memberrs 		= await memberManager.findOne(req.user.username, groupCode);
	if (memberrs.member) grouprs 	= await groupManager.findOne(groupCode);
	if (grouprs.group) photosrs 	= await photoManager.findAllOf(groupCode);

	res.render('photos', {
		title: groupCode + ' | Photos' +  ' | PhotoBook',
		group: grouprs.group,
		user: req.user,
		photos: photosrs.photos,
		error: [memberrs.error, grouprs.error, photosrs.error],
	});
});

router.post('/:groupCode/create', (req, res) => {
	if (!req.user) return res.redirect('../');
	imgMulter.upload(req, res, async function(err) {
		let groupCode = req.query.groupCode;
		let memberrs = {};
		let grouprs = {};
		let result = {};
		// check if user is a member or not
		if (groupCode) memberrs = await memberManager.findOne(req.user.username, groupCode);
		if (memberrs.member) {
			let image = req.files.image;
			// upload to imgur
			if (image) imageSrc = await imgur.upload(image.filename);
			let title = req.body.title;
			let username = req.user.username;
			let date = req.body.date ? new Date(req.body.date) : Date.now();
			let photo = {
				title: title,
				author: username,
				date: date,
				groupCode: groupCode,
				source: imageSrc
			}

			result = await photoManager.create(photo);
 		}
		res.send(result);
	});
});


module.exports = router;