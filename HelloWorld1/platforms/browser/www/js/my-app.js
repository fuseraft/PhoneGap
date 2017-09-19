// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

/* Custom methods */
function BackgroundService() {};
var backgroundService;

BackgroundService.prototype._isInitialized = false;
BackgroundService.prototype._backButtonClickCount = 0;

BackgroundService.prototype.enable = function () {
  cordova.plugins.backgroundMode.setEnabled(true);
};

BackgroundService.prototype.disable = function () {
  cordova.plugins.backgroundMode.setEnabled(false);
};

BackgroundService.prototype.isActive = function () {
  return cordova.plugins.backgroundMode.isActive();
};

BackgroundService.prototype.isForeground = function () {
  return !this.isActive();
};

BackgroundService.prototype.isBackground = function () {
  return this.isActive();
};

BackgroundService.prototype.moveToBack = function () {
  cordova.plugins.backgroundMode.moveToBackground();
};

BackgroundService.prototype.moveToFront = function () {
  cordova.plugins.backgroundMode.moveToForeground();
};

BackgroundService.prototype.excludeFromRecentTasks = function () {
  try {
    cordova.plugins.backgroundMode.excludeFromTaskList();
  }
  catch (err) { /* ignored */ }
};

BackgroundService.prototype.overrideBackButton = function () {
  cordova.plugins.backgroundMode.overrideBackButton();
};

BackgroundService.prototype.wakeUp = function () {
  cordova.plugins.backgroundMode.wakeUp();
};

BackgroundService.prototype.unlock = function () {
  cordova.plugins.backgroundMode.unlock();
};

BackgroundService.prototype.enableQuirksMode = function () {
  if (this._isInitialized) {
    return;
  }

  cordova.plugins.backgroundMode.on('activate', function() {
    try {
      cordova.plugins.backgroundMode.disableWebViewOptimizations();
    }
    catch (err) { /* could not enable quirks mode */ }
  });

  this._isInitialized = true;
};

BackgroundService.prototype.start = function () {
  if (this.isForeground()) {
    this.enableQuirksMode();
    this.enable();
    this.excludeFromRecentTasks();
    this.moveToBack();
    this.overrideBackButton();
  }
};

BackgroundService.prototype.stop = function () {
  if (this.isBackground()) {
    this.moveToFront();
    this.disable();
  }
}

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    backgroundService = new BackgroundService();

    document.addEventListener('backbutton', function () {
      // when the user presses the back button
      // increment this counter
      ++backgroundService._backButtonClickCount;

      // when the user clicks the backbutton 5 times, bring the app to the front
      if (backgroundService._backButtonClickCount === 5) {
        backgroundService._backButtonClickCount = 0;
        backgroundService.stop();
      }
      else {
        backgroundService.start();
      }
    });
}, false);


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})