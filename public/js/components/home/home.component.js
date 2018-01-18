"use strict";

import template from './home.template.html';
import style from './home.template.css';
import $ from 'jquery';

import backgroundUrl from '../../../img/sky-clouds-moon-horizon.jpg';

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["$interval", "authService",
		function homeController($interval, authService) {
			this.backgroundUrl = backgroundUrl;

			this.clock = Date.now();
			$interval(() => this.clock = Date.now(), 1000);

			this.quote = {
				content : "When you feel max-out both mentally and physically, you're only at 40% of your capacity",
				author : 'Medium writer'
			}

			this.isAuthenticated = authService.isAuthenticated();
		}
	]
}
