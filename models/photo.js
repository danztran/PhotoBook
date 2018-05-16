const mongoose 		= require('mongoose');

mongoose.Promise 	= global.Promise;
var PhotoSchema 	= new mongoose.Schema({
	groupCode: String,
	title: String,
	author: String,
	source: String,
	date: Date
});

module.exports 	= mongoose.model('Photo', PhotoSchema);