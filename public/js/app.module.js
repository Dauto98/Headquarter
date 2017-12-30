"use strict"

import angular from 'angular';
import home from './components/home/home.module.js';
import journal from './components/journal/journal.module.js';

angular.module("main", [
	// app files
	home.name,
	journal.name
]).config(['$locationProvider', ($locationProvider) => {
	// use with <base> to remove #! in the url
	$locationProvider.html5Mode(true)
}])
