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
	controller : ["authService", "$transitions", "$state", "$scope",
		function navigatorController(authService, $transitions, $state, $scope) {
			var self = this;

			$transitions.onStart({}, (transition) => {
				if (transition.to().name !== 'login_callback') {
					this.isAuthenticated = authService.isAuthenticated();
				}
			});

			$transitions.onStart({}, (transition) => {
				if (transition.to().name == 'home') {
					self.transparentNavbar = true;
				}
			});

			$transitions.onStart({}, (transition) => {
				if (transition.to().name !== 'home') {
					self.transparentNavbar = false;
				}
			});

			this.login = () => {
				authService.login()
			}

			this.logout = () => {
				authService.logout();
				$state.reload();
				$("#logout-modal").modal('hide')
			}

			this.openLogout = () => {
				$("#logout-modal").modal('show')
			}
		}
	]
}
