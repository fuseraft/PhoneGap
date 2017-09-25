var Poll = {
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
    Logger.log('poll started @ ' + this.getUTCTime() + ', polling on ' + App.pollingMS + ' second intervals');
    this.listener = setInterval(function () {
      if (!silent) {
        Logger.log('poll interval @ ' + this.getUTCTime());
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
      Logger.error('Error in getCoordinates: ' + JSON.stringify(e));
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
