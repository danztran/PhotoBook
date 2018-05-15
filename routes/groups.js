const express 		= require('express');
const router 		= express.Router();

const groupManager 	= require('../db_manager/group-manager');
const memberManager = require('../db_manager/member-manager');

router.get('/', (req, res) => {
	if (!req.user) return res.redirect('../');
	res.render('index', { title: 'Groups | PhotoBook' });
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

module.exports = router;