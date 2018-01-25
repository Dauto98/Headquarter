"use strict"

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap';

import angular from 'angular';
import navigator from './components/navigator/navigator.module.js';
import home from './components/home/home.module.js';
import writing from './components/writing/writing.module.js';
import letterPair from './components/letterPair/letterPair.module.js';

import $ from 'jquery';

import quillEditor from './shares/quillEditor.directive.js';
import authService from './shares/auth.service.js';

angular.module("main", [
	// app files
	navigator.name,
	home.name,
	writing.name,
	letterPair.name,
	quillEditor.name,
	authService.name
]).config(['$locationProvider', '$urlRouterProvider', ($locationProvider, $urlRouterProvider) => {
	// use with <base> to remove #! in the url
	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/');
}]).run(["$transitions", "authService", ($transitions, authService) => {
	//NOTE: redirect to home page if not authenticated
	//NOTE: put in setTimeout in order to delay redirect before silent authentication is finished
	setTimeout(function () {
		$transitions.onStart({}, (transition) => {
			if (transition.to().name !== 'home' && transition.to().name !== 'login_callback') {
				if (!authService.isAuthenticated()) {
					return transition.router.stateService.target('home')
				}
			}
		})
	});

	// NOTE: prevent scrollbar width push everything to the left
	$("body").css('overflow-x', "hidden");
	$("body").width(window.innerWidth);
	window.addEventListener("resize", (event) => {
		$("body").width(window.innerWidth);
	});
}])
