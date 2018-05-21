var imgur = require('imgur');
imgur.setClientId('8a7ef77fa255135');
imgur.setAPIUrl('https://api.imgur.com/3/');

function upload(imgname) {
	return new Promise((resolve, reject) => 
		imgur.uploadFile(__dirname + '/../public/images/' + imgname)
		.then(function (json) {
			resolve(json.data.link);
		})
		.catch(function (err) {
			console.error(err.message);
			reject(err);
		})
	)
}

module.exports.upload = upload;