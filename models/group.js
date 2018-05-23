const mongoose 		= require('mongoose');

mongoose.Promise 	= global.Promise;
Schema 				= mongoose.Schema;
var GroupSchema 	= new mongoose.Schema({
	code		: {type	: String, index	: {unique: true}},
	name		: String,
	date		: Date,
	members		: [{
		type 	: Schema.Types.ObjectId,
		ref 	: 'User'
	}],
	photos 		: [{
		author	: {
			type: Schema.Types.ObjectId,
			ref : 'User'
		},
		title	: String,
		source	: String,
		caption : String,
		date 	: Date
	}]
});

module.exports 	= mongoose.model('Group', GroupSchema);