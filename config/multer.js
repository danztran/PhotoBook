const multer 		= require('multer');
const mkdirp 		= require('mkdirp');

var img = {};

// HANDLING UPLOAD FILE
img.storage = multer.diskStorage({
	destination: function(req, file, callback) {
		mkdirp( __dirname+'/../public/images/', function (err) {
    		if (err) console.error(err)
    		callback(null, __dirname+'/../public/images/');
		});		
	},
	filename: function(req, file, callback) {
		let name = Date.now() + '_' + req.body.code + '_' + file.originalname;
		callback(null, name);
	}
});

img.upload = multer({
	storage: img.storage,
	fileFilter: function(req, file, callback) {
		var ext = (file.originalname).substr((file.originalname).lastIndexOf('.'));
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			return callback(res.end('Only images are allowed'), null);
		}
		callback(null, true);
	}
}).fields([
  { name: 'image', maxCount: 1 },
]);

module.exports.img = img;