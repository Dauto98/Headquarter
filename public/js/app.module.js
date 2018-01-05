"use strict"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap';

import angular from 'angular';
import navigator from './components/navigator/navigator.module.js';
import home from './components/home/home.module.js';
import journal from './components/journal/journal.module.js';

angular.module("main", [
	// app files
	navigator.name,
	home.name,
	journal.name
]).config(['$locationProvider', '$urlRouterProvider', ($locationProvider, $urlRouterProvider) => {
	// use with <base> to remove #! in the url
	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/');
}])
