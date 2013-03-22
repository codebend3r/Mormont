/**
Author: Chester Rivas
Version: 0.01
Date: 3.3.13
*/

var App = {}

App.init = function() {
	console.log('start app');
	App.checkSavedData();
	ko.applyBindings(App.viewModel());
};

App.viewModel = function() {

	var self = this;

	self.savedBudgetList = App.savedData;

	/*
	self.budgetList = ko.computed(function() {
		if ( self.savedBudgetList ) {
			return ko.observableArray(self.savedBudgetList);
		} else {
			return ko.observableArray([]);
		}
		
	}, self);
	*/

	self.expenseList = ko.observableArray([]);

	self.incomeList = ko.observableArray([]);

	self.total = ko.observable(0);

	self.expenseNameAdd = ko.observable("");

	self.expenseCostAdd = ko.observable("");

	self.incomeNameAdd = ko.observable("");

	self.incomeCostAdd = ko.observable("");

	self.expenseTotal = ko.computed(function() {
		var total = 0;
		for ( var i = 0; i < self.expenseList().length; i++) {
			total += Number(self.expenseList()[i].cost);
		}
		return total;
	}, self);

	self.incomeTotal = ko.computed(function() {
		var total = 0;
		for ( var i = 0; i < self.incomeList().length; i++) {
			total += Number(self.incomeList()[i].cost);
		}
		return total;
	}, self);

	self.remainingBudget = ko.computed(function() {
		var total = Number(self.incomeTotal()) - Number(self.expenseTotal());
		return total;
	}, self);

	self.isValidExpenseNumber = ko.computed(function() {
		var textNum = Number(self.expenseCostAdd());
		if ( isNaN(textNum) || textNum == "" ) {
			return false;
		} else {
			return true;
		}
	}, self);

	self.isValidIncomeNumber = ko.computed(function() {
		var textNum = Number(self.incomeCostAdd());
		if ( isNaN(textNum) || textNum == "" ) {
			return false;
		} else {
			return true;
		}
	}, self);

	self.validateExpenseFields = ko.computed(function() {
		if (self.expenseNameAdd().length > 0 && self.expenseCostAdd().length > 0 && self.isValidExpenseNumber() ) {
			return true;
		} else {
			return false;
		}
	}, self);

	self.validateIncomeFields = ko.computed(function() {
		if (self.incomeNameAdd().length > 0 && self.incomeCostAdd().length > 0 && self.isValidIncomeNumber() ) {
			return true;
		} else {
			return false;
		}
	}, self);

	self.addNewExpense = function() {
		if ( self.validateExpenseFields() ) {

			var newExpenseItem = {
				expenseName: self.expenseNameAdd(),
				cost: self.expenseCostAdd()
			}

			self.expenseList.push(newExpenseItem);

			self.clearField();

			App.savedData.expenseData = self.expenseTotal();
			localStorage.setItem("savedBudgetData", App.savedData);

    	}
	};

	self.addNewIncome = function() {
		if ( self.validateIncomeFields() ) {

			var newIncomeItem = {
				incomeName: self.incomeNameAdd(),
				cost: self.incomeCostAdd()
			}

			self.incomeList.push(newIncomeItem);

			self.clearField();

			App.savedData.incomeData = self.incomeTotal();
			localStorage.setItem("savedBudgetData", App.savedData);

    	}
	};

	self.clearField = function() {
		self.expenseNameAdd("");
		self.expenseCostAdd("");

		$('.add-expense-modal').hide();
		$('.add-income-modal').hide();
		$('.lightbox').hide();
	};

	self.showExpenseModal = function() {
		$('.add-expense-modal').show();

		$('.lightbox').width = $(window).width();
		$('.lightbox').height = $(window).height();
		$('.lightbox').show();
	};

	self.showIncomeModal = function() {
		$('.add-income-modal').show();

		$('.lightbox').width = $(window).width();
		$('.lightbox').height = $(window).height();
		$('.lightbox').show();
	};

	return self;

}

App.savedData = {
	expenseData: null,
	incomeData: null
};

App.checkSavedData = function() {
	var savedBudgetData = localStorage.getItem("savedBudgetData");
	if (savedBudgetData) {
		App.savedData = savedBudgetData;
	}
};

$(App.init);