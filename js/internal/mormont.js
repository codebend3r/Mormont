/**
Author: Chester Rivas
Version: 0.02
Date: 3.3.13
*/

var App = {}

App.init = function() {
	console.log('start app');

	App.checkSavedData();

};

App.getCurrentDate = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    var hr = today.getHours();
    var min = today.getMinutes();

    var monthsList = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

    if(dd<10){dd='0'+dd}
    if(min<10){min='0'+min}

    var formattedDate = monthsList[Number(mm)] + ' ' + dd + ' ' + yyyy + ' ' + hr + ':' + min;

    return {
        displayDate: formattedDate,
        dateObj: today,
        hr: hr,
        min: min,
        month: mm,
        day: dd
    };
};

App.dateOneMinuteFromNow = function() {
    var d1 = new Date (),
        d2 = new Date ( d1 );
    d2.setMinutes ( d1.getMinutes() + 1 );
    return d2;
};

App.dateOneHourFromNow = function() {
    var d1 = new Date (),
        d2 = new Date ( d1 );
    d2.setHours( d1.getHours() + 1 );
    return d2;
};

App.timeDifference = function(time1, time2) {
    console.log('time1', time1);
    console.log('time2', time2);
    var diff = Math.abs(time1-time2);
    return diff;
};

App.viewModel = function() {

	var self = this;

	self.expenseList = ko.observableArray(App.savedData.expenseData) || ko.observableArray([]);

	self.incomeList = ko.observableArray(App.savedData.incomeData) || ko.observableArray([]);

	self.recurringItems = ko.observableArray(App.savedData.recurringItems) || ko.observableArray([]);

	self.total = ko.observable(0);

    //////////////////

	self.expenseNameAdd = ko.observable("");

	self.expenseCostAdd = ko.observable("");

	self.expenseRecurring = ko.observable(false);

    self.expenseDateAdded = ko.observable("");

    /////////////////

	self.incomeNameAdd = ko.observable("");

	self.incomeCostAdd = ko.observable("");

	self.incomeRecurring = ko.observable(false);

    self.incomeDateAdded = ko.observable("");

    /////////////////

    self.recurringOptions = ko.observableArray(['Minutely', 'Hourly', 'Daily', 'Weekly', 'Bi-Weekly', 'Bi-Monthly', 'Monthly']);

    self.updateRecurrence = function(originalDate, rType) {

        rType = rType || 'minutely'

        var diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        var diffInSeconds2 = App.timeDifference(originalDate.dateObj, App.dateOneHourFromNow());

        console.log('diffInSeconds', diffInSeconds);
        console.log('diffInSeconds2', diffInSeconds2);

        setTimeout(cloneEntry(), diffInSeconds);

    };

	self.expenseTotalPrice = ko.computed(function() {
		var total = 0;
		for ( var i = 0; i < self.expenseList().length; i++) {
			total += Number(self.expenseList()[i].cost);
		}
		return '$' + total;
	}, self);

    self.expenseTotal = ko.computed(function() {
        var total = 0;
        for ( var i = 0; i < self.expenseList().length; i++) {
            total += Number(self.expenseList()[i].cost);
        }
        return total;
    }, self);

	self.incomeTotalPrice = ko.computed(function() {
		var total = 0;
		for ( var i = 0; i < self.incomeList().length; i++) {
			total += Number(self.incomeList()[i].cost);
		}
		return '$' + total;
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
		return '$' + total;
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
				cost: self.expenseCostAdd(),
				recurring: self.expenseRecurring(),
                dateCreated: App.getCurrentDate().displayDate,
                dateAddRecurrence: self.updateRecurrence(App.getCurrentDate())
			}

			self.expenseList.push(newExpenseItem);

			self.clearField();

			//App.savedData.expenseData.push(newExpenseItem);
			App.saveBudget();

    	}
	};

    self.removeExpense = function() {
        self.expenseList.remove(this);
    };

	self.addNewIncome = function() {
		if ( self.validateIncomeFields() ) {

			var newIncomeItem = {
				incomeName: self.incomeNameAdd(),
				cost: self.incomeCostAdd(),
                recurring: self.incomeRecurring(),
                dateCreated: App.getCurrentDate().displayDate,
                dateAddRecurrence: self.updateRecurrence(App.getCurrentDate())
			}

			self.incomeList.push(newIncomeItem);

            self.recurringItems.push(newIncomeItem);

			self.clearField();

			//App.savedData.incomeData.push(newIncomeItem);
            App.saveBudget();

    	}
	};

    self.removeIncome = function() {
        self.incomeList.remove(this);
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

    self.closeModal = function() {
        self.clearField();
    };

    self.clearStorage = function() {
        console.log('STORAGE CLEARED');
        localStorage.clear();
    };

    self.init = function() {

        //loop through all recurring items

    };

    self.init();

	return self;

}

App.localStorageObjectKey = 'savedBudgetData';

App.saveBudget = function() {

    localStorage.clear();

    console.log('App.savedData', App.savedData);

    // Put the object into storage
    localStorage.setItem(App.localStorageObjectKey, JSON.stringify(App.savedData));

};

App.savedData = {
	expenseData: [],
	incomeData: [],
    recurringItems: []
};

App.checkSavedData = function() {

    // Retrieve the object from storage
    var savedBudgetDataString = localStorage.getItem(App.localStorageObjectKey),
        savedBudgetDataObject;

	if (savedBudgetDataString) {

        console.log('RETRIEVING APP DATA');

        savedBudgetDataObject = JSON.parse(savedBudgetDataString);

        console.log('savedBudgetDataObject', savedBudgetDataObject);

		App.savedData = savedBudgetDataObject;

        ko.applyBindings(App.viewModel());

	} else {

        console.log('NO APP DATA');
        ko.applyBindings(App.viewModel());

    }

};

$(App.init);