module.exports = function(app) {

	var User = app.models.users;

	var MainController = {
		login: function(req, res) {
			if (req.method == 'GET') {
				res.render('login', {message: req.flash('success')});
			} else {
				User.findOne({email: req.body.email, password: req.body.password}).exec(function(error, user) {
					if (user) {
						if (user.active) {
							req.session.user = user;
							res.redirect('/');
						} else {
							req.flash('success', 'You need to validate your account.');
							res.redirect('/login');
						}
					} else {
						req.flash('success', 'Invalid e-mail address or password.');
						res.redirect('/login');
					}
				});
			}
		},
		signup: function(req, res) {
			if (req.method == 'GET') {
				res.render('signup', {message: req.flash('success')});
			} else {
				User.findOne({email: req.body.email}, function(error, user) {
					if (!user) {
						User.create({name: req.body.name, email: req.body.email, password: req.body.password, active: false, picture: 'default.png'}, function(error, user) {
							if (error) {
								console.log("There was a problem adding the information to the database.\n", error);
								res.redirect('/login');
							} else {
								var link = 'http://url/validate-account/' + req.body.email;
								var confMail = {
									from: 'Contato <contato@sk8sta13.dx.am>',
									to: user.name + '<' + req.body.email + '>',
									subject: 'Iae - Validate your account',
									html: '<!DOCTYPE html><html><head><title>Iae - Validate your account</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;background-color:#eff0f3;"><table cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="height:50px;background-color:#2c3742;"><h1 style="margin:0 10px;font-weight:500;line-height:1.1;color:#FFF;">Iae - Validate your account</h1></td></tr><tr><td><div style="margin:10px;padding:30px 0;float: none;-webkit-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;-moz-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;-ms-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;-o-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;background:#fff;-webkit-border-radius:6px;-moz-border-radius:6px;-ms-border-radius:6px;-o-border-radius:6px;border-radius:6px;"><p style="display:block;margin:5px 10px;font-family:Open Sans, sans-serif;font-size:14px;">You made a record in Iae to communicate in real time with your friends, click the link below to validate your account.</p><p style="display:block;margin:5px 10px;font-family:Open Sans, sans-serif;font-size:14px;"><a href="' + link + '">Validate your account</a></p></div></td></tr></table></body></html>'
								};

								mail.sendMail(confMail, function(error, info) {
									if (error) {
										console.log('There was a problem send the mail.', error);
										req.flash('succes', 'There was a problem sending the email, please try again later.')
									} else {
										req.flash('success', 'We send an email to ' + req.body.email + ' with a link to validate your account.');
									}
									res.redirect('/login');
								});
							}
						});
					} else {
						req.flash('success', 'This email is already registered.');
						res.redirect('signup');
					}
				});
			}
		},
		validateAccount: function(req, res) {
			User.findOne({email: req.params.email, active: false}, function(error, user) {
				if (!error) {
					user.active = true;
					user.save();
					req.flash('success', 'Your account has been successfully validated.');
				} else {
					req.flash('success', "We think you're trying to hack our system.");
				}
				res.redirect('/login');
			});
		},
		forgot: function(req, res) {
			User.findOne({email: req.body.email}).exec(function(error, user) {
				if (!error) {
					if (user === null) {
						req.flash('success', 'We did not find any user with that email.');
					} else {
						var link = 'http://url/update-password/' + user.email + '/' + user._id;
						var confMail = {
							from: 'Contato <contato@sk8sta13.dx.am>',
							to: user.name + '<' + req.body.email + '>',
							subject: 'Iae - I forgot my password',
							html: '<!DOCTYPE html><html><head><title>Iae - I forgot my password</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;background-color:#eff0f3;"><table cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="height:50px;background-color:#2c3742;"><h1 style="margin:0 10px;font-weight:500;line-height:1.1;color:#FFF;">Iae - I forgot my password</h1></td></tr><tr><td><div style="margin:10px;padding:30px 0;float: none;-webkit-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;-moz-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;-ms-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;-o-box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;box-shadow:rgba(0, 0, 0, 0.4) 0 1px 3px, rgba(0, 0, 0, 0.35) 0 0 1px;background:#fff;-webkit-border-radius:6px;-moz-border-radius:6px;-ms-border-radius:6px;-o-border-radius:6px;border-radius:6px;"><p style="display:block;margin:5px 10px;font-family:Open Sans, sans-serif;font-size:14px;">This email was sent for password recovery if it is not you who has requested the re-registration of a new password, please disregard this email.</p><p style="display:block;margin:5px 10px;font-family:Open Sans, sans-serif;font-size:14px;">If you have been then click the link below to continue.</p><p style="display:block;margin:5px 10px;font-family:Open Sans, sans-serif;font-size:14px;"><a href="' + link + '">re-register</a></p></div></td></tr></table></body></html>'
						};

						mail.sendMail(confMail, function(error, info) {
							if (error) {
								console.log('There was a problem send the mail.', error);
								req.flash('succes', 'There was a problem sending the email, please try again later.')
							} else {
								req.flash('success', 'An email was sent to ' + req.body.email + ' what should be done.');
							}
							res.redirect('/login');
						});
					}
				} else {
					console.log("There was a problem adding the information to the database.");
					res.redirect('/login');
				}
			});
		},
		updatePassword: function(req, res) {
			if (req.method == 'GET') {
				res.render('updatePassword', {email: req.params.email, id: req.params.id});
			} else {
				User.findOne({email: req.body.email, _id: req.body.id}, function(error, user) {
					if (!error) {
						user.password = req.body.password;
						user.save();
						req.flash('success', 'Your password has been successfully changed.');
					} else {
						req.flash('success', "We think you're trying to hack our system.");
					}
					res.redirect('/login');
				});
			}
		},
		index: function(req, res) {
			User.find({_id: req.session.user._id}).select('friends').exec(function(error, users) {
				if (!error) {
					res.render('index', {friends: users});
				} else {
					console.log('error');
				}
			});
		},
		logout: function(req, res) {
			req.session.destroy();
			res.redirect('/');
		},
		profile: function(req, res) {
			if (req.method == 'GET') {
				res.render('profile', {user: req.session.user});
			} else {
				User.findById(req.session.user._id, function(error, user) {
					user.name = req.body.name;
					user.phone = req.body.phone;
					if (typeof req.files.picture !== 'undefined') {
						user.picture = req.files.picture.name;
					}
					user.save(function() {
						req.session.user = user;
						res.redirect('/profile');
					});
				});
			}
		},
		deleteAccount: function(req, res) {
			User.remove({_id: req.session.user._id}, function(error) {
				req.session.destroy();
				res.redirect('/');
			});
		},
		search: function(req, res) {
			User.find({email: req.body.email}).select('_id name email').exec(function(error, users) {
				if (users) {
					res.json({status: 'success', users: users});
				} else {
					res.json({status: 'empty'});
				}
			});
		},
		addFriend: function(req, res) {
			User.findById(req.session.user._id, function(error, user) {
				user.friends.push({email: req.body.email});
				console.log(user.friends);
				user.save();
			});
		}
	};

	return MainController;

};