var AppFunc = {
  clearLog: function () {
    $$('#log div').remove();
  },
  toggleBackground: function () {
    Background.toggleStatus();

    var status = Background.getStatus();
    var text = !status ? 'Start Background' : 'Stop Background';

    Logger.log('status = ' + status + '');

    $$('#btn-start-background').text(text);
  },
  _gpsWatchInterval: null,
  getLocationWatch: function () {
    if (_gpsWatchInterval) {
      navigator.geolocation.clearWatch(_gpsWatchInterval);
      $$('#btn-log-location').text('Log Location');
    }
    else {
      _gpsWatchInterval = Geolocation.watchPosition();
      $$('#btn-log-location').text('Logging Location...');
    }
  },
  getLocation: function () {
    if ($$('#chk-use-watch').is(':checked')) {
      AppFunc.getLocationWatch();
      return;
    }

    if (Poll.listener) {
      Poll.stop();
      $$('#btn-log-location').text('Log Location');
    }
    else {
      Poll.start(Geolocation.getCoordinates, true);
      $$('#btn-log-location').text('Logging Location...');
    }
  },
  readGPS: function () {
    try {
      GpsJson.writeJson(
        'gps-' +
        (new Date(Date.now()).toSqliteString())
          .replace(/\.| |-|:|/g, '') +
        '.json');
    }
    catch (err) {
      Logger.error(err.message);
    }
  },
  writeGPS: function () {
    // Geolocation.resetCoordinates();
    Geolocation.toggleSqliteWrite();

    $$('#btn-write-sqlite').text(
      Geolocation.canWriteToSqlite()
      ? 'Writing to SQLite'
      : 'Write to SQLite'
    );
  }
}
