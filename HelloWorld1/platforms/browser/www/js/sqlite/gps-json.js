var GpsJson = {
  _path: null,
  writeFile: function (data) {
    if (!GpsJson._path) {
      Logger.log('typeof GpsJson._path: ' + (typeof GpsJson._path));
      Logger.log('GpsJson._path: ' + GpsJson._path);
      return;
    }

    GpsJson._path.createWriter(function (fileWriter) {
      fileWriter.seek(fileWriter.length);
      fileWriter.write(new Blob([data], { type: 'text/plain' }));
      Logger.log('finished writing JSON')
    },
    function (err) {
      Logger.error('could not write JSON: ' + JSON.stringify(err));
    });
  },
  writeJson: function (json) {
    Logger.log('writing to ' + json);

    Geolocation.readCoordinates(function (rs) {
      // iterate the table data and build a Framework7 plain datatable
      try {
        var i, len = rs.rows.length, row, data = [];

        for (i = 0; i < len; i++) {
          row = rs.rows.item(i);
          data.push({
            poll: row.Poll,
            lat: row.Latitude,
            long: row.Longitude
          })
        }

        GpsJson.createFile(json, function () {
          GpsJson.writeFile(JSON.stringify(data));
        });
      }
      catch (err) {
        Sqlite.error(err.message);
      }
    });
  },
  createFile: function (jsonPath, onSuccess) {
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dir) {
      Logger.log('got path: ' + dir.fullPath);
      dir.getFile(jsonPath, { create: true }, function (file) {
        Logger.log('created file: ' + file.fullPath);
        GpsJson._path = file;

        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      });
    });
  }
};
