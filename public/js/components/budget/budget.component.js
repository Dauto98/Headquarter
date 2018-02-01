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
			var self = this
			this.budgetNavState = 'overview'

			this.changeBudgetNav = (state) => {
				this.budgetNavState = state;
				if (state == 'all-trans') {
					self.transactions = budgetService.getAllTransaction();
					setTimeout(function () {
						$('.input-daterange input').each(function() {
							$(this).datepicker();
						});
					});
				}
			}

			var {totalBudget , budgetState, budgetCategory} = budgetService.getOverview();
			this.totalBudget = totalBudget;
			this.budgetState = budgetState;
			this.budgetCategory = budgetCategory;
		}
	]
}
