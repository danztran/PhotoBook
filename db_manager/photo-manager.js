var Photo = require('../models/photo.js');

let photoManager = {
	create: function(photo) {
		return new Promise((resolve, reject) => {
			new Photo(photo).save((err, newPhoto) => {
				if (err) reject({error: err});
				else resolve(newPhoto);
			});
		});
	},
	findAllOf: function(groupCode) {
		return new Promise((resolve, reject) => {
			Photo.find({groupCode: groupCode}, (err, photos) => {
				if (err) reject({error: err});
				else resolve({photos: photos});
			});
		});
	}

}