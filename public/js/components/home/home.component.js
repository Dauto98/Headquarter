"use strict";

angular.module('home').component('home', {
	templateUrl : 'js/components/home/home.template.html',
	controller : [
		function homeController() {
			this.test = 'This is the hone'
		}
	]
})
