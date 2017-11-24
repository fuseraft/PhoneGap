// added a toSqliteString function to the Date prototype
// this is important for storing DATETIME in Sqlite databases
Date.prototype.toSqliteString = function () {
  var value = new Date(this.valueOf()),
    year = '' + value.getFullYear(),
    month = value.getMonth() + 1,
    day = value.getDate(),
    h = value.getHours(),
    m = value.getMinutes(),
    s = value.getSeconds(),
    ms = value.getMilliseconds();

  month = '' + (month < 10 ? '0' : '') + month;
  day = '' + (day < 10 ? '0' : '') + day;
  h = '' + (h < 10 ? '0' : '') + h;
  m = '' + (m < 10 ? '0' : '') + m;
  s = '' + (s < 10 ? '0' : '') + s;
  ms = '' + (ms < 10 ? '0' : '') + ms;

  // YYYY-MM-DD HH:MM:SS.SSS
  return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s + '.' + ms;
}

// an individual parameter
function SqliteParam() {}
// container object for SqliteParam objects
function SqliteParams() { this.params = []; }
// common SQLite types enum
var SqliteTypes = {
  DATETIME: 'DATETIME',
  INT: 'INT',
  REAL: 'REAL',
  TEXT: 'TEXT',
  BLOB: 'BLOB',
  NULL: 'NULL'
};

/*
* SqliteQuery
*/
function SqliteQuery(query) {
  this.text = query;
}

SqliteQuery.prototype.toString = function () {
  return this.text;
}

SqliteQuery.prototype.setQuery = function (query) {
  this.text = query;
}

SqliteQuery.prototype.hasParam = function (name) {
  return this.text.indexOf(name) > -1;
}

/*
* SqliteParam
*/
SqliteParam.prototype = {
  name: null,
  value: null,
  type: null
};

/*
* SqliteParams
*/
SqliteParams.prototype.add = function (name, type, value) {
  var param = new SqliteParam();
  param.name = name;
  param.type = type;
  param.value = value;

  this.params.push(param);
};

SqliteParams.prototype.sanitizeString = function (s) {
  if (!s || typeof s !== 'string' || s.length === 0) {
    return '';
  }

  return s.replace(/'/g, '\\\'');
};

SqliteParams.prototype.parameterize = function (query) {
  var name = null,
      param = null,
      value = null,
      regex = null,
      i = 0,
      len = this.params.length;

  if (!query || !(query instanceof SqliteQuery) || query.toString().length === 0) {
    throw new Error('query is empty');
  }

  for (i = 0; i < len; i++) {
    param = this.params[i];
    name = param.name;

    value = param.value || SqliteTypes.NULL;

    if (!query.hasParam(name)) {
      continue;
    }

    regex = new RegExp(name, 'g');

    switch (param.type) {
      case SqliteTypes.TEXT:
      case SqliteTypes.DATETIME:
        // if this is a Date object, set value to valid Sqlite date string
        if (value && typeof value.getDate === 'function') {
          value = value.toSqliteString();
        }
        // if this is a string value, sanitize it to prevent SQL injection
        else {
          value = this.sanitizeString(value);
        }

        // if the value is not null, wrap in single quotes
        if (value !== SqliteTypes.NULL) {
          value = '\'' + value + '\'';
        }
        break;
    }

    query.setQuery(query.toString().replace(regex, value));
  }

  return query;
};
