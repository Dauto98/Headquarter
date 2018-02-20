"use strict";

import template from './home.template.html';
import style from './home.template.css';
import $ from 'jquery';
import sample from 'lodash/sample';

var backgroundSrcList = require.context("../../../img/homeBackground", true, /\.(png|jpeg|jpg|gif)$/);
backgroundSrcList = backgroundSrcList.keys().map(backgroundSrcList)

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["$interval", "authService",
		function homeController($interval, authService) {
			this.backgroundSrc = sample(backgroundSrcList);

			this.clock = Date.now();
			$interval(() => this.clock = Date.now(), 1000);

			this.quote = sample([
				{
					content : "When you feel max-out both mentally and physically, you're only at 40% of your capacity",
					author : 'Medium writer'
				},
				{
					content : "If you need permission, you probably shouldn't do it",
					author : 'Medium writer'
				},
				{
					content : "Don’t think. You already know what you have to do, and you know how to do it. What’s stopping you?",
					author : 'Tim Grover'
				},
				{
					content : "Sometimes before I go to sleep, I lay in bed. thinking of how many things I could have done to be a better human today",
					author : 'The Angry Therapist'
				},
			]);

			this.isAuthenticated = authService.isAuthenticated();
		}
	]
}
