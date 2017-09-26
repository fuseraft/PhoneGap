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
};
