module.exports = function(app) {
	var ChatController = {
		index: function(req, res){
			res.render('chat', {sala: req.query.sala});
		}
	};
	return ChatController;
};