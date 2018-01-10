const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

var writing = mongoose.Schema({
	delta : {},
	html : String
}, {timestamps : true});

writing.pre('save', function (next) {
	this.html = sanitizeHtml(this.html, {
		allowedTags : sanitizeHtml.defaults.allowedTags.concat(['img'])
	});
	next();
})

module.exports = mongoose.model('writing', writing);
