var Logger = {
  _log: function (message, isError) {
    $$('#log')
      .append(
        '<div class="'
        + (isError ? 'log-error' : 'log-message')
        + '">'
        + message
        + '</div>'
      );
  },
  log: function (message) {
    this._log(message, false);
  },
  error: function (message) {
    this._log(message, true);
  }
};
