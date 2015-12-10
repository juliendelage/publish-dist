'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var meow = require('meow');

var cache = undefined;

exports['default'] = function () {
  if (cache) {
    return cache;
  }
  var opts = {
    pkg: '../package.json'
  };
  cache = meow(opts);
  return cache;
};

module.exports = exports['default'];