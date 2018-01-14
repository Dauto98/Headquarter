const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

var writing = mongoose.Schema({
	delta : {},
	html : String
}, {timestamps : true});

writing.pre('save', sanitizeInputHtml);
writing.pre('update', sanitizeInputHtml);
writing.pre('updateMany', sanitizeInputHtml);
writing.pre('updateOne', sanitizeInputHtml);

function sanitizeInputHtml(next) {
	this.html = sanitizeHtml(this.html, {
		allowedTags : sanitizeHtml.defaults.allowedTags.concat(['img'])
	});
	next();
}

module.exports = mongoose.model('writing', writing);
