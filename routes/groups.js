const express 		= require('express');
const router 		= express.Router();

const imgMulter		= require('../config/multer').img;
const imgur 			= require('../config/imgur');

const groupManager 	= require('../db_manager/group-manager');

router.get('/', async (req, res) => {
	if (!req.user) return res.redirect('../');
	let userId = req.user._id;
	// find all group have user in
	let rs = await groupManager.findAllOf(userId);
	if (rs.error) req.flash("groupQuery", rs.error);
	res.render('groups', { 
		title: 'Groups | PhotoBook', 
		groups: rs.groups,
		user: req.user
	});
});

router.post('/create', async (req, res) => {
	if (!req.user) return res.redirect('../');
	let name = req.body.groupName;
	let code = req.body.groupCode;
	let result = await groupManager.create(req.user._id, name, code);
	if (result.error) return res.send(result);
	if (result.group) result.group._id = undefined;
	res.render('piece-views/group', {
		group: result.group
	}, function(err, rendered) {
		if (err) result.renErr = err;
		result.render = rendered;
		res.send(result);
	});
});

router.post('/addMember', async (req, res) => {
	if (!req.user) return res.redirect('../');
	let username = req.body.username;
	let groupCode = req.body.groupCode;
	let result = await groupManager.addMember(req.user._id, username, groupCode);
	if (result.group) result.group._id = undefined;
	res.send(result);
});

router.get('/:groupCode', async (req, res) => {
	if (!req.user) return res.redirect('../');
	let groupCode = req.params.groupCode;
	let query = await groupManager.findOne(groupCode);
	if (query.error) req.flash('groupQuery', query.error);
	if (query.group) 
		if (!query.group.members.some(val => val._id.toString() == req.user._id.toString()))
			return res.redirect('../signout');

	// sort ngày
	let photos = query.group.photos;
	photos = photos.sort((a, b) => - new Date(a.date).getTime() + new Date(b.date).getTime());
	let allDates = [];
	let allPhotosOnSameDay = [];

	// lấy toàn bộ ngày
	for (let i = 0; i < photos.length; i++) {
		let dateStr = new Date(photos[i].date).toLocaleDateString();
		if (!allDates.includes(dateStr))
			allDates.push(dateStr);
	}

	// query ảnh theo ngày
	for (let i = 0; i < allDates.length; i++) { // chạy từng ngày
		allPhotosOnSameDay[i] = [];
		for (let b = 0; b < photos.length; b++) { // chạy từng ảnh
			let dateStr = new Date(photos[b].date).toLocaleDateString();
			if (dateStr == allDates[i]) {
				allPhotosOnSameDay[i].push(photos[b]);
			}
		}
	}

	res.render('photos', {
		title: groupCode + ' | Photos' +  ' | PhotoBook',
		group: query.group,
		dates: {allDates, allPhotosOnSameDay},
		user: req.user
	});
});

router.post('/:groupCode/upload', (req, res) => {
	if (!req.user) return res.redirect('../');
	imgMulter.upload(req, res, async (error) => {
		if (error) return res.send({error});
		let result = await groupManager.addPhoto(req);
		res.send(result);
	});
});

module.exports = router;