// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


var App = {
  listener: null,
  pollingMS: 10000,
  getUTCTime: function () {
    return new Date(Date.now()).toUTCString();
  },
  stop: function () {
    Logger.log('poll stopped @ ' + this.getUTCTime());
    clearInterval(this.listener);
    this.listener = null;
  },
  start: function (callback, silent) {
    Logger.log('poll started @ ' + this.getUTCTime()+ 'set at '+App.pollingMS+' seconds');
    this.listener = setInterval(function () {
      if (!silent) {
        Logger.log('interval @ ' + this.getUTCTime());
      }
      // call the callback
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, this.pollingMS);
  },
  getCoordinates: function () {
    // if an error occurs, show an error on the map
    var onError = function (e) {
      Logger.log('Error in getCoordinates: ' + JSON.stringify(e));
    };

    var onSuccess = function(e) {
      if (e && e.coords) {
        Logger.log(
          new Date(Date.now())+'coordinates at ['
          + e.coords.latitude
          + ','
          + e.coords.longitude
          + ']'
        );
      }
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
};

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  try {
    $$('#clearlog').on('click', function () {
      $$('#log div').remove();
    });

//open email client to attach cords.

    $$('#emailLog').on('click',function(){
        var theLog = document.getElementById("log").innerText.toString();
      console.log(theLog);
    window.open('mailto:shortdude18@gmail.com?subject=Cords&body='+theLog);


    });
    // user clicked the Get Location button
    $$('#location').on('click', function() {
      if (App.listener) {
        App.stop();
        $$('#location').text('Log Location');
      }
      else {
        App.start(App.getCoordinates, true);
        $$('#location').text('Logging Location...');
      }
    });

    $$('#startbackground').on('click', function () {
      Background.toggleStatus();

      //var status = !!parseInt($$('#startbackground').attr('data-status'));
      var status = !!Background.getStatus();
      var text = !status ? 'Start Background' : 'Stop Background';

      $$('#startbackground').text(text);
    });
  } catch (err) {
      Logger.log('ERROR: ' + err.message);
  }
}, false);

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

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
