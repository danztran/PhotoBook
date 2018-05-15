const mongoose 		= require('mongoose');

mongoose.Promise 	= global.Promise;
var UserSchema 	= new mongoose.Schema({
	username	: {
		type	: String,
		index	: {unique: true}
	},
	password	: String,
});

module.exports 	= mongoose.model('User', UserSchema);