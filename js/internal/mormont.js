/**
 Author: Chester Rivas
 Version: 0.03
 Date: 7.4.13
 */

var App = {};

App.init = function () {

  console.log('start app');
  App.checkSavedData();

};

App.getCurrentDate = function () {

  var today = new Date(),
  dd = today.getDate(),
  mm = today.getMonth(),
  yyyy = today.getFullYear(),
  hr = today.getHours(),
  min = today.getMinutes(),
  utcDate = today.getUTCDate();

  var monthsList = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (min < 10) {
    min = '0' + min;
  }

  var formattedDate = monthsList[Number(mm)] + ' ' + dd + ' ' + yyyy + ' ' + hr + ':' + min;

  return {
    displayDate: formattedDate,
    dateObj: today,
    hr: hr,
    min: min,
    month: mm,
    day: dd,
    year: yyyy,
    utcDate: utcDate
  };

};

App.dateOneMinuteFromNow = function () {
  var d1 = new Date(),
      d2 = new Date(d1);
  d2.setMinutes(d1.getMinutes() + 1);
  return d2;
};

App.dateOneHourFromNow = function () {
  var d1 = new Date(),
      d2 = new Date(d1);
  d2.setHours(d1.getHours() + 1);
  return d2;
};

App.dateOneDayFromNow = function () {
  var d1 = new Date(),
      d2 = new Date(d1);
  d2.setDate(d1.getDate() + 1);
  return d2;
};

App.dateOneWeekFromNow = function () {
  var d1 = new Date(),
      d2 = new Date(d1);
  d2.setDate(d1.getDate() + 7);
  return d2;
};

App.dateOneMonthFromNow = function () {
  var d1 = new Date(),
      d2 = new Date(d1);
  d2.setMonth(d1.getMonth() + 1);
  return d2;
};

App.timeDifference = function (time1, time2) {
  /*
  if (time1 typeof Date) {
    console.log('Date Type');
  } else if (time1 typeof Number){
    console.log('Number Type');
  }
  */
  var diff = Math.abs(time1 - time2);
  return diff;
};

App.viewModel = function () {

  var self = this;

  self.expenseList = ko.observableArray(App.savedData.expenseData) || ko.observableArray([]);

  self.incomeList = ko.observableArray(App.savedData.incomeData) || ko.observableArray([]);

  self.recurringExpenseList = ko.observableArray(App.savedData.recurringExpense) || ko.observableArray([]);

  self.recurringIncomeList = ko.observableArray(App.savedData.recurringIncome) || ko.observableArray([]);

  self.total = ko.observable(0);

  //////////////////

  self.expenseNameAdd = ko.observable("");

  self.expenseCostAdd = ko.observable("");

  self.isExpenseRecurring = ko.observable(false);

  self.chosenOption = ko.observable("");

  self.expenseRecurring = ko.computed(function() {

    if (self.isExpenseRecurring()) {
      $('.add-expense-modal').height(450);
    } else {
      $('.add-expense-modal').height(350);
    }

    return self.isExpenseRecurring();

  }, self);

  self.expenseDateAdded = ko.observable("");

  /////////////////

  self.incomeNameAdd = ko.observable("");

  self.incomeCostAdd = ko.observable("");

  self.isIncomeRecurring = ko.observable(false);

  self.incomeRecurring = ko.computed(function () {

    if (self.isIncomeRecurring()) {
      $('.add-income-modal').height(450);
    } else {
      $('.add-income-modal').height(350);
    }

    return self.isIncomeRecurring();

  }, self);

  self.incomeDateAdded = ko.observable("");

  /////////////////

  self.recurringOptions = ko.observableArray(['Minutely', 'Hourly', 'Daily', 'Weekly', 'Bi-Weekly', 'Bi-Monthly', 'Monthly', 'Annual']);

  self.updateRecurrence = function(originalDate, rType) {

    rType = typeof rType !== 'undefined' ? rType : 'Hourly';

    //console.log('originalDate', originalDate);
    //console.log('rType', rType);

    var diffInSeconds;

    console.log('originalDate.dateObj', originalDate.dateObj);

    switch (rType) {
      case 'Minutely':
        console.log('MINUTES');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Hourly':
        console.log('HOURLY');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Daily':
        console.log('DAILY');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneDayFromNow());
        break;
      case 'Weekly':
        console.log('WEEKLY');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneWeekFromNow());
        break;
      case 'Bi-Weekly':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Bi-Monthly':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Monthly':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMonthFromNow());
        break;
      case 'Annual':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
    }

    //diffInSeconds2 = App.timeDifference(originalDate.dateObj, App.dateOneHourFromNow());

    console.log('diffInSeconds', diffInSeconds);
    //console.log('diffInSeconds2', diffInSeconds2);

    setTimeout(self.cloneEntry, diffInSeconds);
    //setInterval(self.cloneEntry, 60000);

  };

  self.cloneEntry = function() {

    var clonedExpense = self.expenseList()[self.expenseList().length - 1];
    clonedExpense.dateCreated = App.getCurrentDate().displayDate;
    self.expenseList.push(clonedExpense);

  };

  self.expenseTotalPrice = ko.computed(function () {
    var total = 0;
    for (var i = 0; i < self.expenseList().length; i++) {
      total += Number(self.expenseList()[i].cost);
    }
    return '$' + total;
  }, self);

  self.expenseTotal = ko.computed(function () {
    var total = 0;
    for (var i = 0; i < self.expenseList().length; i++) {
      total += Number(self.expenseList()[i].cost);
    }
    return total;
  }, self);

  self.incomeTotalPrice = ko.computed(function () {
    var total = 0;
    for (var i = 0; i < self.incomeList().length; i++) {
      total += Number(self.incomeList()[i].cost);
    }
    return '$' + total;
  }, self);

  self.incomeTotal = ko.computed(function () {
    var total = 0;
    for (var i = 0; i < self.incomeList().length; i++) {
      total += Number(self.incomeList()[i].cost);
    }
    return total;
  }, self);

  self.remainingBudget = ko.computed(function () {
    var total = Number(self.incomeTotal()) - Number(self.expenseTotal());
    return '$' + total;
  }, self);

  self.isValidExpenseNumber = ko.computed(function () {
    var textNum = Number(self.expenseCostAdd());
    if (isNaN(textNum) || textNum == "") {
      return false;
    } else {
      return true;
    }
  }, self);

  self.isValidIncomeNumber = ko.computed(function () {
    var textNum = Number(self.incomeCostAdd());
    if (isNaN(textNum) || textNum == "") {
      return false;
    } else {
      return true;
    }
  }, self);

  self.validateExpenseFields = ko.computed(function () {
    if (self.expenseNameAdd().length > 0 && self.expenseCostAdd().length > 0 && self.isValidExpenseNumber()) {
      return true;
    } else {
      return false;
    }
  }, self);

  self.validateIncomeFields = ko.computed(function () {
    if (self.incomeNameAdd().length > 0 && self.incomeCostAdd().length > 0 && self.isValidIncomeNumber()) {
      return true;
    } else {
      return false;
    }
  }, self);

  self.addNewExpense = function () {

    //if required fields are valid then continue
    if (self.validateExpenseFields()) {

      var newExpenseItem = {
        expenseName: self.expenseNameAdd(),
        cost: self.expenseCostAdd(),
        recurring: self.expenseRecurring(),
        recurringInterval: self.chosenOption(),
        dateCreated: App.getCurrentDate().displayDate,
        dateObject: App.getCurrentDate(),
        dateAddRecurrence: self.updateRecurrence(App.getCurrentDate())
      };

      console.log('newExpenseItem', newExpenseItem);

      self.expenseList.push(newExpenseItem);
      if (newExpenseItem.recurring) self.recurringExpenseList.push(newExpenseItem);
      self.clearField();

      //App.savedData.expenseData.push(newExpenseItem);
      App.saveBudget();

    }

  };

  self.removeExpense = function () {
    self.expenseList.remove(this);
  };

  self.addNewIncome = function () {
    if (self.validateIncomeFields()) {

      var newIncomeItem = {
        incomeName: self.incomeNameAdd(),
        cost: self.incomeCostAdd(),
        recurring: self.incomeRecurring(),
        dateCreated: App.getCurrentDate().displayDate,
        fullDate: new Date(),
        dateAddRecurrence: self.updateRecurrence(App.getCurrentDate())
      };

      console.log('newIncomeItem', newIncomeItem);

      self.incomeList.push(newIncomeItem);

      self.expenseRecurring.push(newIncomeItem);

      self.clearField();

      //App.savedData.incomeData.push(newIncomeItem);
      App.saveBudget();

    }
  };

  self.removeIncome = function () {
    self.incomeList.remove(this);
  };

  self.clearField = function () {
    self.expenseNameAdd("");
    self.expenseCostAdd("");

    $('.add-expense-modal').hide();
    $('.add-income-modal').hide();
    $('.lightbox').hide();
  };

  self.showExpenseModal = function () {
    $('.add-expense-modal').show();

    $('.lightbox').width = $(window).width();
    $('.lightbox').height = $(window).height();
    $('.lightbox').show();
  };

  self.showIncomeModal = function () {
    $('.add-income-modal').show();

    $('.lightbox').width = $(window).width();
    $('.lightbox').height = $(window).height();
    $('.lightbox').show();
  };

  self.closeModal = function () {
    self.clearField();
  };

  self.clearStorage = function () {
    console.log('STORAGE CLEARED');
    localStorage.clear();
  };

  self.findTimeDifference = function(originalDate, rType){
    var diffInSeconds;
    switch (rType) {
      case 'Minutely':
        console.log('MINUTES');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Hourly':
        console.log('HOURLY');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Daily':
        console.log('DAILY');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneDayFromNow());
        break;
      case 'Weekly':
        console.log('WEEKLY');
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneWeekFromNow());
        break;
      case 'Bi-Weekly':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Bi-Monthly':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
      case 'Monthly':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMonthFromNow());
        break;
      case 'Annual':
        diffInSeconds = App.timeDifference(originalDate.dateObj, App.dateOneMinuteFromNow());
        break;
    }
  };

  self.init = function () {

    //loop through all recurring items
    $(App.savedData.recurringExpense).each(function(i){

      var currentItem = App.savedData.recurringExpense[i];

      console.log('currentItem', currentItem);

      var fullDate = currentItem.dateObject;
      var dateCreatedInMinutes = fullDate.min;
      var dateCreatedInHours = fullDate.hour;

      var currentDate = App.getCurrentDate();

      var currentTimeInMinutes = currentDate.min;
      var currentTimeInHours = currentDate.hour;

      console.log('dateCreatedInMinutes', dateCreatedInMinutes);
      console.log('dateCreatedInHours', dateCreatedInHours);
      console.log('//////////////////////////');
      console.log('currentTimeInMinutes', currentTimeInMinutes);
      console.log('currentTimeInHours', currentTimeInHours);
      //console.log('currentDate', currentDate);

      //var diffInSeconds = App.timeDifference(dateCreated, currentDate);

      //console.log('diffInSeconds', diffInSeconds);

    })

  };

  self.init();

  return self;

}

App.localStorageObjectKey = 'savedBudgetData';

App.saveBudget = function () {

  localStorage.clear();

  console.log('App.savedData', App.savedData);

  // Put the object into storage
  localStorage.setItem(App.localStorageObjectKey, JSON.stringify(App.savedData));

};

App.savedData = {
  expenseData: [],
  incomeData: [],
  recurringExpense: [],
  recurringIncome: []
};

App.checkSavedData = function () {

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