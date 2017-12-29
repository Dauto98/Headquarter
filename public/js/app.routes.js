"use strict";

angular.module('main').config(["$stateProvider", "$locationProvider",
	($stateProvider, $locationProvider) => {
		// use with <base> to remove #! in the url
		$locationProvider.html5Mode(true)

		$stateProvider.state({
			name : 'home',
			url : '/',
			component : 'home'
		}).state({
			name : 'journal',
			url : '/journal',
			component : 'journal'
		})
	}
])
