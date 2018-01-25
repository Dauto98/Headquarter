const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

var writing = mongoose.Schema({
	delta : {},
	html : String,
	type : {
		type : String,
		required : true
	}
}, {timestamps : true});

writing.pre('save', sanitizeInputHtml);
writing.pre('update', sanitizeInputHtmlOnUpdate);
writing.pre('updateMany', sanitizeInputHtmlOnUpdate);
writing.pre('updateOne', sanitizeInputHtmlOnUpdate);

function sanitizeInputHtml(next) {
	this.html = sanitizeHtml(this.html, {
		allowedTags : sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'br'])
	});
	next();
}

function sanitizeInputHtmlOnUpdate(next) {
	this.update({}, {$set : {html : sanitizeHtml(this.getUpdate().$set.html, {
		allowedTags : sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'br'])
	})}})
	next();
}

module.exports = mongoose.model('writing', writing);
