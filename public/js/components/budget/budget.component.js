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
			var self = this, usedDate;
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
					initDatePicker("overview__datepicker", from, to, (newFrom, newTo) => {
						for (var i = 0; i < self.categories.length; i++) {
							self.categories[i].transactions = filterTransactionByDate(newFrom, newTo, categories[i].transactions);
						};
						$scope.$apply();
					});
					initDatePicker("stateModal__datepicker", from, to, (newFrom, newTo) => {
						self.stateChangeTransactions = filterTransactionByDate(newFrom, newTo, budgetService.getAllTransaction().filter(transaction => transaction.type === 'changeState'))
						$scope.$apply();
					})
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
					initDatePicker("allTrans__datepicker", from, to, (newFrom, newTo) => {
						self.transactions = filterTransactionByDate(newFrom, newTo, budgetService.getAllTransaction());
						$scope.$apply();
					})
				}, 0, from, to);
			}

			/**
			 * init variable for new transaction tab
			 * @return {None}
			 */
			function initNewTrans() {
				self.formInput_type = "expense";
				initExpenseForm();
				setTimeout(function () {
					$(".newTrans__datePicker").datepicker().on("hide", (event) => {
						let date = $(".newTrans__datePicker").datepicker("getDate");
						date = new Date(date);
						usedDate = date.getTime();
					})
				});
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
			 * initialize datepicker with custom from, to and on Hide event handler
			 * @param  {String} name          Name of the class of the div containing the datepicker
			 * @param  {Number} from          Initial from unix time
			 * @param  {Number} to            Initial to unix time
			 * @param  {Function} onHideHandler
			 * @return {None}
			 */
			function initDatePicker(name, from, to, onHideHandler) {
				$(`.input-daterange.${name} input`).each(function() {
					$(this).datepicker();
					if (this.className.includes("fromDate")) {
						$(this).datepicker("update", new Date(from));
					} else if (this.className.includes("toDate")) {
						$(this).datepicker("update", new Date(to));
					};
					$(this).datepicker().on("hide", (event) => {
						let from = (new Date($(`.${name} .fromDate`).datepicker("getDate"))).getTime();
						let to = (new Date($(`.${name} .toDate`).datepicker("getDate"))).getTime();
						onHideHandler(from, to);
					});
				});
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

			self.formInput_type_change = (field) => {
				if (field === 'expense') {
					initExpenseForm();
				} else if (field === 'gain') {
					initGainForm();
				} else if (field === 'changeState') {
					initChangeStateForm();
				} else if (field === 'changeCategory') {
					initChangeCategoryForm()
				}
			};

			function initExpenseForm() {
				self.formInput_category = "nes";
				self.formInput_state = "active"
			}

			function initGainForm() {
				self.formInput_category = {};
			}

			function initChangeStateForm() {
				self.formInput_state = {
					from : "inactive",
					to : "active"
				};
			}

			function initChangeCategoryForm() {
				self.formInput_category = {
					from : "nes",
					to : "edu"
				};
			}

			self.submitTransactionForm = () => {
				var data = {
					usedDate : usedDate,
					value : self.formInput_value,
					description : self.formInput_description,
					type : self.formInput_type,
					category : self.formInput_category,
					state : self.formInput_state
				};
				budgetService.createNewTransaction(data).then((res) => {
					console.log(res);
				}).catch((err) => {
					console.log(err);
				})
			}
		}
	]
}
