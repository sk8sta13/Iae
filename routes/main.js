module.exports = function(app){

	var auth = require('./../middleware/autenticate');
	var main = app.controllers.main;

	app.get('/', auth, main.index);

	app.post('/forgot', main.forgot);
	app.get('/update-password/:email/:id', main.updatePassword);
	app.post('/update-password/:email/:id', main.updatePassword);

	app.get('/login', main.login);
	app.post('/login', main.login);

	app.get('/signup', main.signup);
	app.post('/signup', main.signup);

	app.get('/validate-account/:email', main.validateAccount);

	app.get('/logout', auth, main.logout);

	app.get('/profile', auth, main.profile);
	//app.post('/profile', auth, main.profile);
	app.post('/profile', upload, main.profile);

	app.get('/delete-account', auth, main.deleteAccount);

	app.post('/search', auth, main.search);
	app.post('/add-friend', auth, main.addFriend);

};