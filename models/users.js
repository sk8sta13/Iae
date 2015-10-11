module.exports = function(app) {

	var Schema = require('mongoose').Schema;

	var friends = Schema({
		email: String
	});

	var users = Schema({
		name: String,
		phone: String,
		email: {
			type: String,
			unique: true
		},
		password: String,
		picture: String,
		active: Boolean,
		status: {
			type: String,
			enum: ['Online', 'Busy', 'Offline'],
			default: 'Offline'
		},
		friends: [friends],
		created_at: {type: Date, default: Date.now}
	});

	return db.model('users', users);

};