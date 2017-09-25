// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  try {
    $$('#clearlog').on('click', function () {
      $$('#log div').remove();
    });

    // open email client to attach cords.
    $$('#emailLog').on('click',function(){
      var theLog = document.getElementById("log").innerText.toString();
      console.log(theLog);
      window.open('mailto:shortdude18@gmail.com?subject=Cords&body='+theLog);
    });

    // user clicked the Get Location button
    $$('#location').on('click', function() {
      if (Poll.listener) {
        Poll.stop();
        $$('#location').text('Log Location');
      }
      else {
        Poll.start(Poll.getCoordinates, true);
        $$('#location').text('Logging Location...');
      }
    });

    $$('#startbackground').on('click', function () {
      Background.toggleStatus();

      var status = !!Background.getStatus();
      var text = !status ? 'Start Background' : 'Stop Background';

      $$('#startbackground').text(text);
    });

    $$('#test-sqlite').on('click', function () {
      Sqlite.test();
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
