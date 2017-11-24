var Background = {
  _isInitialized: false,
  _status: false,
  enable: function () {
    Logger.log('enabling background mode');
    cordova.plugins.backgroundMode.setEnabled(true);
  },
  disable: function () {
    Logger.log('disabling background mode');
    cordova.plugins.backgroundMode.setEnabled(false);
  },
  enableQuirksMode: function () {
    if (this._isInitialized) {
      return;
    }

    Logger.log('enabling quirks mode');

    cordova.plugins.backgroundMode.on('activate', function() {
      try {
        Logger.log('activated, disabling web view optimizations');
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
      }
      catch (err) {
        Logger.error('error: ' + err.message);
      }
    });

    this._isInitialized = true;
  },
  start: function () {
    Logger.log('starting background mode');

    this.enable();
    this.enableQuirksMode();

    this._status = true;
  },
  stop: function () {
    Logger.log('stopping background mode');

    this.disable();

    this._status = false;
  },
  toggleStatus: function () {
    Logger.log('toggling background mode');

    if (this._status) {
      this.stop();
    }
    else {
      this.start();
    }
  },
  getStatus: function () {
    return this._status;
  }
};
