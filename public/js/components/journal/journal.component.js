"use strict";

import template from './journal.template.html';
import style from './journal.template.css';
import $ from 'jquery';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["writingService", "$scope",
		function journalController(writingService, $scope) {
			var self = this, currentEditingId;

			this.subnavState = 'write';

			this.changeSubNav = (state) => {
				currentEditingId = null;
				this.initContent = null;
				this.subnavState = state;
				if (state == 'list') {
					getAllWriting()
				}
			}

			function getAllWriting() {
				writingService.getAllWriting().then((data) => {
					self.allWriting = data;
					$scope.$apply();
				})
			}

			this.onSummit = (delta, html) => {
				writingService.saveWriting('journal', delta, html, currentEditingId).then((res) => {
					getAllWriting();
					this.subnavState = 'list';
				});
			}

			this.removeWriting = (id) => {
				writingService.remove(id).then((res) => {
					getAllWriting()
				})
			}

			this.editWriting = (id) => {
				writingService.getWritingById(id).then((data) => {
					currentEditingId = data._id;
					this.initContent = data.delta;
					this.subnavState = 'write';
					$scope.$apply()
				})
			}
		}
	]
}
