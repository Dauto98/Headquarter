"use strict";

import template from './dashboard.template.html';
import style from './dashboard.template.css';
import $ from 'jquery';

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["authService", "$scope",
		function dashboardController(authService, $scope) {
			var self = this;

			self.script = "";

			self.submitScript = () => {
				fetch(`${process.env.API_URL}dashboard/shell`, {
					method: 'post',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json',
						"Authorization" : `Bearer ${authService.getAccessToken()}`
					},
					body: JSON.stringify({script : self.script})
				}).then(res => res.json()).then(data => {
					self.result = data.result;
					$scope.$apply()
				})
			}
		}
	]
}
