"use strict";

angular.module('journal').component('journal', {
	templateUrl : 'js/components/journal/journal.template.html',
	controller : [
		function journalController() {
			this.test = 'This is your writing space'
		}
	]
})
