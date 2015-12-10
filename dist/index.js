'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _publish = require('./publish');

var _publish2 = _interopRequireDefault(_publish);

exports['default'] = function () {
  require('./opts')();
  (0, _parse2['default'])(_publish2['default']);
};

module.exports = exports['default'];