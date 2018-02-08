"use strict";

import template from './budget.template.html';
import style from './budget.template.css';
import $ from 'jquery';
import datepicker from 'bootstrap-datepicker';

export default {
	template : () => {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["budgetService", "$scope",
		function budgetController(budgetService, $scope) {
			var self = this;
			self.budgetNavState = 'overview';
			initOverview();

			/**
			 * handle change in budget tabs
			 * @param  {String} state
			 * @return {None}
			 */
			self.changeBudgetNav = (state) => {
				self.budgetNavState = state;
				if (state == 'all-trans') {
					initAllTrans()
				} else if (state == 'overview') {
					initOverview();
				} else if (state == 'new-trans') {
					initNewTrans();
				}
			};

			/**
			 * init variable for overview tab
			 * @return {None}
			 */
			function initOverview() {
				var {total , states, categories} = budgetService.getOverview();
				self.total = total;
				self.states = states;
				self.categories = angular.copy(categories);
				var {from, to} = getDefaultDateRange();
				for (var i = 0; i < self.categories.length; i++) {
					self.categories[i].transactions = filterTransactionByDate(from, to, categories[i].transactions);
				};
				// wait for angular to mount the DOM before executing Jquery
				setTimeout(function (from, to) {
					$('.input-daterange.overview__datepicker input ').each(function() {
						$(this).datepicker();
						if (this.className.includes("fromDate")) {
							$(this).datepicker("update", new Date(from));
						} else if (this.className.includes("toDate")) {
							$(this).datepicker("update", new Date(to));
						};
						$(this).datepicker().on("hide", (event) => {
							let from = (new Date($(".overview__datepicker .fromDate").datepicker("getDate"))).getTime();
							let to = (new Date($(".overview__datepicker .toDate").datepicker("getDate"))).getTime();
							for (var i = 0; i < self.categories.length; i++) {
								self.categories[i].transactions = filterTransactionByDate(from, to, categories[i].transactions);
							};
							$scope.$apply();
						});
					});
				}, 0, from, to);
			}

			/**
			 * init variable for all transactions tab
			 * @return {None}
			 */
			function initAllTrans() {
				self.transactions = budgetService.getAllTransaction();
				var {from, to} = getDefaultDateRange();
				self.transactions = filterTransactionByDate(from, to, self.transactions);
				setTimeout(function (from, to) {
					$('.input-daterange.allTrans__datepicker input').each(function() {
						$(this).datepicker();
						if (this.className.includes("fromDate")) {
							$(this).datepicker("update", new Date(from));
						} else if (this.className.includes("toDate")) {
							$(this).datepicker("update", new Date(to));
						};
						$(this).datepicker().on("hide", (event) => {
							let from = (new Date($(".allTrans__datepicker .fromDate").datepicker("getDate"))).getTime();
							let to = (new Date($(".allTrans__datepicker .toDate").datepicker("getDate"))).getTime();
							self.transactions = filterTransactionByDate(from, to, budgetService.getAllTransaction());
							$scope.$apply();
						});
					});
				}, 0, from, to);
			}

			/**
			 * init variable for new transaction tab
			 * @return {None}
			 */
			function initNewTrans() {
				self.form_type = "expense";
				initExpenseForm();
			}

			/**
			 * return default date range for date picker, which is the last 7 days
			 * @return {Object} contain UNIX time of the first and last milisecond of 7 days period
			 */
			function getDefaultDateRange() {
				let toDate = new Date();
				toDate.setHours(23, 59, 59, 999);
				let fromDate = new Date(Date.now() - 7 * 86400000);
				fromDate.setHours(23, 59, 59, 999);
				return {to : toDate.getTime(), from : fromDate.getTime()}
			}

			/**
			 * filter transactions array base on input time range
			 * @param  {Number} from  starting UNIX time
			 * @param  {Number} to    ending UNIX time
			 * @param  {Array} array transactions array
			 * @return {Array}       the filtered transactions array
			 */
			function filterTransactionByDate(from, to, array) {
				return array.filter((transaction) => (transaction.usedDate >= from && transaction.usedDate <= to));
			}

			self.openDetailModal = (id) => {
				self.transactionDetailModal = budgetService.getAllTransaction().filter(transaction => transaction._id == id)[0];
				$("#transactionDetailModal").modal('show');
			}

			self.openStateModal = () => {
				self.stateChangeTransactions = budgetService.getAllTransaction().filter(transaction => transaction.type === 'changeState');
				$("#stateModal").modal('show');
			}

			self.form_type_change = (field) => {
				if (field === 'expense') {
					initExpenseForm();
				} else if (field === 'gain') {
					initGainForm();
				} else if (field === 'changeState') {
					initChangeStateForm();
				}
			};

			function initExpenseForm() {
				self.form_category = "nes";
				self.form_state = "active"
			}

			function initGainForm() {

			}

			function initChangeStateForm() {

			}
		}
	]
}
