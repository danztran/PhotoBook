const mongoose 		= require('mongoose');

mongoose.Promise 	= global.Promise;
var MemberSchema 	= new mongoose.Schema({
	groupCode: String,
	username: String
});

MemberSchema.index({ groupCode: 1, username: 1 }, { unique: true });

module.exports 	= mongoose.model('Member', MemberSchema);