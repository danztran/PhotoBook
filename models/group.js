const mongoose 		= require('mongoose');

mongoose.Promise 	= global.Promise;
var GroupSchema 	= new mongoose.Schema({
	name	: String,
	code	: {
		type	: String,
		index	: {unique: true}
	},
	date	: Date
});

module.exports 	= mongoose.model('Group', GroupSchema);