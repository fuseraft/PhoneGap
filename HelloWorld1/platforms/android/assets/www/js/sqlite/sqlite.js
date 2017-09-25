var Sqlite = {
  db: null,
  log: function (message) {
    Logger.log('SQLite: ' + message);
  },
  error: function (message) {
    Logger.error('SQLite error: ' + message);
  },
  test: function () {
    try {
      // open the db and create a Test table if it doesn't exist
      this.log('opening the db');
      this.open('test.db', 'default');

      this.log('creating table Test');
      this.exec('CREATE TABLE IF NOT EXISTS Test (intId INT, dteTest DATETIME, strTest TEXT)');

      // build an INSERT statement
      var insert = new SqliteQuery(
        'INSERT INTO Test (intId, dteTest, strTest) \
         VALUES (@IntTest, @DateTest, @StringTest)'
      );
      // build a SELECT statement
      var select = new SqliteQuery('SELECT * FROM Test');
      // build a DROP statement
      var drop = new SqliteQuery('DROP TABLE Test');

      this.log('built INSERT: <code>' + insert.toString() + '</code>');

      this.log('building SqliteParams');
      // create param container
      var params = new SqliteParams();

      // parameterize the INSERT statement
      params.add('@IntTest', SqliteTypes.INT, 1);
      params.add('@DateTest', SqliteTypes.DATETIME, new Date(Date.now()));
      params.add('@StringTest', SqliteTypes.TEXT, 'Hello, World!');
      params.parameterize(insert);

      this.log('parameterized INSERT: <code>' + insert.toString() + '</code>');

      // execute the insert, select data from it and print a JSON-serialized result set
      this.log('executing INSERT and SELECT');
      this.exec(insert.toString());
      this.exec(select.toString(), function (rs) {
        Sqlite.log('result set: <code>' + JSON.stringify(rs) + '</code>');
      });

      // drop the table and close the db
      this.log('executing DROP');
      this.exec(drop.toString());
    }
    catch (err) {
      Logger.error(err.message);
    }
  },
  open: function (name, location) {
    try {
      // open the database and create the main table if it doesn't EXISTS
      this.db = window.sqlitePlugin.openDatabase({name: name, location: location});
      this.exec('CREATE TABLE IF NOT EXISTS GPSCoordinates (poll DATETIME, latitude TEXT, longitude TEXT)');
      this.log('opened a connection to the db');
    }
    catch (err) {
      this.error('db error: ' + err.message);
    }
  },
  exec: function (sql, resultCallback) {
    if (!this.db) {
      this.error('the db has not been opened yet')
      return;
    }

    this.db.transaction(function(tx) {
      tx.executeSql(sql, [], function (tx, rs) {
          if (resultCallback && typeof resultCallback === 'function') {
            // do something with the data
            resultCallback(rs);
          }
      });
    },
    function(err) {
      Sqlite.error('db error: ' + err.message);
    });
  }
};
