var Geolocation = {
  _gpsDB: 'hello-world-gps.db',
  _writeToSqlite: false,
  _showOnlyErrors: true,
  _showErrors: true,
  log: function (message) {
    if (Geolocation._showOnlyErrors) {
      return;
    }

    Logger.log('Geolocation: ' + message);
  },
  error: function (message) {
    if (!Geolocation._showErrors) {
      return;
    }

    Logger.error('Geolocation error: ' + message);
  },
  enableSqliteWrite: function () {
    Geolocation._setSqliteWriteEnabled(true);
  },
  disableSqliteWrite: function () {
    Geolocation._setSqliteWriteEnabled(false);
  },
  toggleSqliteWrite: function () {
    Geolocation._setSqliteWriteEnabled(!Geolocation._writeToSqlite);
  },
  _setSqliteWriteEnabled: function (toggle) {
    if (typeof toggle !== 'boolean') {
      throw new Error('Geolocation._setSqliteWriteEnabled expected a boolean parameter');
    }

    Geolocation._writeToSqlite = toggle;
  },
  canWriteToSqlite: function () {
    return this._writeToSqlite;
  },
  ensureGPSCoordinatesTableExists: function (isRead) {
    if (!this.canWriteToSqlite() && !isRead) {
      Geolocation.log('write to SQLite is disabled');
      return;
    }

    // open the db and return if we can't open it
    Sqlite.open(this._gpsDB, 'default');

    if (!Sqlite.isOpen()) {
      throw new Error('could not write to Sqlite, could not open db');
    }

    // create the table if it doesn't exist
    Sqlite.exec(
      'CREATE TABLE IF NOT EXISTS GPSCoordinates (Poll DATETIME, Latitude TEXT, Longitude TEXT)'
    );
  },
  writeCoordinates: function (time, lat, long) {
    var params = null,
      insert = null;

    try {
      Geolocation.ensureGPSCoordinatesTableExists();

      // build an insert statement
      insert = new SqliteQuery(
        'INSERT INTO GPSCoordinates (Poll, Latitude, Longitude) ' +
        'VALUES (@Poll, @Lat, @Long)'
      );

      // build parameters
      params = new SqliteParams();
      params.add('@Poll', SqliteTypes.DATETIME, time);
      params.add('@Lat', SqliteTypes.TEXT, lat);
      params.add('@Long', SqliteTypes.TEXT, long);
      params.parameterize(insert);

      // insert the GPS coordinates
      Sqlite.exec(insert);
    }
    catch (err) {
      Geolocation.error(err.message);
    }
  },
  readCoordinates: function (resultCallback) {
    var coords = [],
      select = null,
      params = null;

    try {
      Geolocation.ensureGPSCoordinatesTableExists(true);

      select = new SqliteQuery(
        'SELECT * ' +
        'FROM GPSCoordinates ' +
        '-- WHERE poll > @LastRetrieval'
      );

      // uncomment when finished testing
      //params = new SqliteParams();
      //params.add('@LastRetrieval', SqliteTypes.DATETIME, new Date(Date.now()));
      //params.parameterize(select);

      if (!resultCallback || typeof resultCallback !== 'function') {
        resultCallback = function (rs) {
          Sqlite.log('result set: <code>' + JSON.stringify(rs) + '</code>');
        };
      }

      Sqlite.exec(select, resultCallback);
    }
    catch (err) {
      this.error(err.message);
    }

    return coords;
  },
  onError: function (e) {
    // if an error occurs, show an error on the map
    Geolocation.error('error in getCoordinates: ' + JSON.stringify(e));
  },
  onSuccess: function (e) {
    if (e && e.coords) {
      var time = new Date(Date.now()),
        lat = e.coords.latitude,
        long = e.coords.longitude;

      Geolocation.log(time + ', coordinates at [' + lat + ',' + long + ']');

      // write to sqlite
      if (Geolocation.canWriteToSqlite()) {
        Geolocation.writeCoordinates(time, lat, long);
      }
    }
    else {
      Geolocation.error('could not retrieve coordinates');
    }
  },
  getCoordinates: function () {
    navigator.geolocation.getCurrentPosition(Geolocation.onSuccess, Geolocation.onError);
  }
};
