// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  try {
    $$('#btn-clear-log').on('click', function () {
      $$('#log div').remove();
    });

    // open email client to attach cords.
    $$('#btn-email-log').on('click',function(){
      var theLog = $$('#log').text();
      console.log(theLog);
      window.open('mailto:shortdude18@gmail.com?subject=Cords&body=' + theLog);
    });

    // user clicked the Get Location button
    $$('#btn-log-location').on('click', function() {
      if (Poll.listener) {
        Poll.stop();
        $$('#btn-log-location').text('Log Location');
      }
      else {
        Poll.start(Geolocation.getCoordinates, true);
        $$('#btn-log-location').text('Logging Location...');
      }
    });

    $$('#btn-start-background').on('click', function () {
      Background.toggleStatus();

      var status = !!Background.getStatus();
      var text = !status ? 'Start Background' : 'Stop Background';

      $$('#btn-start-background').text(text);
    });

    $$('#btn-test-sqlite').on('click', function () {
      Sqlite.test();
    });

    $$('#btn-start-background').on('click', function () {
      Background.toggleStatus();

      var status = !!Background.getStatus();
      var text = !status ? 'Start Background' : 'Stop Background';

      $$('#btn-start-background').text(text);
    });

    $$('#btn-write-sqlite').on('click', function () {
      // Geolocation.resetCoordinates();
      Geolocation.toggleSqliteWrite();

      $$('#btn-write-sqlite').text(
        Geolocation.canWriteToSqlite()
        ? 'Writing to SQLite'
        : 'Write to SQLite'
      );
    });

    $$('#btn-read-sqlite').on('click', function () {
      Geolocation.readCoordinates(function (rs) {
        // iterate the table data and build a Framework7 plain datatable
        try {
          var i, len = rs.rows.length, row, data = '';

          data +=
            '<thead>\
              <tr>\
                <th class="label-cell">Poll</th>\
                <th class="label-cell">Lat</th>\
                <th class="label-cell">Long</th>\
              </tr>\
            </thead>\
            <tbody>'

          for (i = 0; i < len; i++) {
            row = rs.rows.item(i);
            data +=
              '<tr>' +
                '<td class="label-cell">' + row.Poll + '</td>' +
                '<td class="numeric-cell">' + row.Latitude + '</td>' +
                '<td class="numeric-cell">' + row.Longitude + '</td>' +
              '</tr>';
          }

          data += '</tbody>';

          data =
            '<div class="data-table">' +
              '<table>' +
                data +
              '</table>' +
            '</div>';

          Sqlite.log(
            '<div class="data-table"><table>' + data + '</table>');
        }
        catch (err) {
          Sqlite.error(err.message);
        }
      });
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
