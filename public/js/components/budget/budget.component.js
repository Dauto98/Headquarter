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
	controller : ["budgetService",
		function budgetController(budgetService) {
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
				self.categories = categories;
			}

			/**
			 * init variable for all transactions tab
			 * @return {None}
			 */
			function initAllTrans() {
				self.transactions = budgetService.getAllTransaction();
				setTimeout(function () {
					$('.input-daterange input').each(function() {
						$(self).datepicker();
					});
				});
			}

			/**
			 * init variable for new transaction tab
			 * @return {None}
			 */
			function initNewTrans() {

			}

			self.openDetailModal = (id) => {
				console.log(id);
				self.transactionDetailModal = budgetService.getAllTransaction().filter(transaction => transaction._id == id)[0];
				$("#transactionDetailModal").modal('show');
			}

			self.openStateModal = () => {
				self.stateChangeTransactions = budgetService.getAllTransaction().filter(transaction => transaction.type === 'changeState');
				$("#stateModal").modal('show');
			}
		}
	]
}
