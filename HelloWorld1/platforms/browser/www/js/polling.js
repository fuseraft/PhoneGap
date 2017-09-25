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
    Logger.log('poll started @ ' + this.getUTCTime() + ', polling on ' + (this.pollingMS / 1000) + ' second intervals');
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
      var lat, long, time = Poll.getUTCTime();

      if (e && e.coords) {
        lat = e.coords.latitude;
        long = e.coords.longitude;
        
        Logger.log(time + ', coordinates at [' + lat + ',' + long + ']');
      }
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
};
