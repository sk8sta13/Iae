var express = require('express');
var load = require('express-load');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
global.db = mongoose.connect('mongodb://localhost/iae');

var nemail = require('nodemailer');
global.mail = nemail.createTransport({
	host: 'mail.sk8sta13.dx.am',
	port: '587',
	auth: {
		user: 'contato@sk8sta13.dx.am',
		pass: 'm1a2r3c4e5l6o7'
	},
	tls: {
		rejectUnauthorized: false
	}
});

var multer = require('multer');
global.upload = multer({
	dest: __dirname + '/public/images/users/',
	limits: {files: 1},
	onFileUploadStart: function(file) {
		if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return false;
        }
    }
});
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

const KEY = 'fglIae.sid', SECRET = 'fglIae';
var cookie = cookieParser(SECRET);
var store = new session.MemoryStore();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookie);
app.use(session({resave: true, saveUninitialized: true, secret: SECRET, key: KEY, store: store}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(flash());


io.use(function(socket, next) {
  var data = socket.request;
  cookie(data, {}, function(err) {
    var sessionID = data.signedCookies[KEY];
    store.get(sessionID, function(err, session) {
      if (err || !session) {
        return next(new Error('Acesso negado!'));
      } else {
        socket.handshake.session = session;
        return next();
      }
    });
  });
});

load('models')
	.then('controllers')
	.then('routes')
	.into(app);

load('sockets')
	.into(io);

/*app.listen(3000, function(){
  console.log('Iae running!!!');
});*/

server.listen(3000, function() {
	console.log('Iae running!!!');
});