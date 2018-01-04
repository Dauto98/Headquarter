"use strict";

import template from './journal.template.html';
import style from './journal.template.css';
import $ from 'jquery';

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : [
		function journalController() {
			this.test = 'This is your writing space'
		}
	]
}
