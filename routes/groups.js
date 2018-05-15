const express 		= require('express');
const router 		= express.Router();

const groupManager 	= require('../db_manager/group-manager');
const memberManager = require('../db_manager/member-manager');

router.get('/', (req, res) => {
	if (!req.user) return res.redirect('../');
	res.render('index', { title: 'Groups | PhotoBook' });
});

router.post('/create', (req, res) => {
	if (!req.user) return res.redirect('../');
	let newGroup = {
		name: req.body.groupName,
		code: req.body.groupCode,
		date: Date.now()
	}
	let result = groupManager.create(newGroup);
	res.send(result);
});

router.post('/addMember', (req, res) => {
	if (!req.user) return res.redirect('../');
	let newMember = {
		username: req.body.username,
		groupCode: req.body.groupCode
	}
	let result = memberManager.create(newMember);
	res.send(result);
});



module.exports = router;