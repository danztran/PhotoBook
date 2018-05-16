var Photo = require('../models/photo.js');

let photoManager = {
	create: function(photo) {
		return new Promise((resolve, reject) => {
			new Photo(photo).save((error, newPhoto) => {
				if (error) return resolve({error});
				else resolve(newPhoto);
			});
		});
	},
	findAllOf: function(groupCode) {
		return new Promise((resolve, reject) => {
			Photo.find({groupCode: groupCode}, (error, photos) => {
				if (error) return resolve({error});
				else resolve({photos});
			});
		});
	}

}