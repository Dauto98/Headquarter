"use strict";

import template from './navigator.template.html';
import style from './navigator.template.css';
import $ from 'jquery';

export default {
	template : () => {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : [
		function navigatorController() {

		}
	]
}
