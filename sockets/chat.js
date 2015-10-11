module.exports = function(io) {
	var crypto = require('crypto');
	var md5 = crypto.createHash('md5');
	var sockets = io.sockets;
	
	sockets.on('connection', function(client) {
		var session = client.handshake.session;

		client.on('join', function (sala) {
			if (!sala) {
				var md5 = crypto.createHash('md5');
				sala = md5.update(new Date().toString()).digest('hex');
			}

			session.sala = sala;
			client.join(sala);

			var msg = '<b>' + session.user.name + '</b> enter.<br />';
			sockets.in(sala).emit('send-client', msg);
		});
		
		client.on('disconnect', function() {
			client.broadcast.emit('notify-offlines', session.user.email);
			var msg = '<b>' + session.user.name + '</b> exit.<br />';
			sockets.in(session.sala).emit('send-client', msg);
			client.leave(session.sala);
		});

		client.on('send-server', function (smsg) {
			client.broadcast.emit('new-message', {email: session.user.email, sala: session.sala});
			var msg = '<b>' + session.user.name + '</b>: ' + smsg.msg + '<br />';
			sockets.in(session.sala).emit('send-client', msg);
		});
	});
};