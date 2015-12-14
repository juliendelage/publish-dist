'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fs = require('fs');

var _child_process = require('child_process');

var _config = require('./config');

var pkg = JSON.parse((0, _fs.readFileSync)('./package.json'));
var opts = require('./opts')();
var async = require('async');
var osHomedir = require('os-homedir');
var parseAuthor = require('parse-author');

function add(cb) {
  var cmd = 'git add dist';
  (0, _child_process.exec)(cmd, cb);
}

function configName(cb) {
  var name = opts.flags.authorName || parseAuthor(pkg.author).name;
  var cmd = 'git config user.name "' + name + '"';
  (0, _child_process.exec)(cmd, cb);
}

function configEmail(cb) {
  var email = opts.flags.authorEmail || parseAuthor(pkg.author).email;
  var cmd = 'git config user.email "' + email + '"';
  (0, _child_process.exec)(cmd, cb);
}

function commit(cb) {
  var cmd = ['git commit dist', opts.flags.skipHooks === true ? '--no-verify' : '', '--message "' + _config.knownCommit.header[opts.flags.skipCi === true ? 1 : 0] + '"'].join(' ');
  (0, _child_process.exec)(cmd, cb);
}

function netrc(cb) {
  var host = 'machine github.com\n  login ' + process.env.CI_USER_TOKEN + '\n';
  var netrc = osHomedir() + '/.netrc';
  (0, _fs.appendFile)(netrc, host, cb);
}

function push(cb) {
  var cmd = ['git push', opts.flags.skipHooks === true ? '--no-verify' : '', 'origin HEAD:master'].join(' ');
  (0, _child_process.exec)(cmd, cb);
}

function publish() {
  var steps = [add, configName, configEmail, commit, netrc, push];

  function done(err, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + (stderr || 'none'));
    if (err) {
      console.log('exec error: ' + err);
      throw err;
    }
    console.log('A new build has been pushed. You can ignore the next error :)');
    process.exit(1);
  }

  if (!process.env.CI_USER_TOKEN) {
    throw new Error('process.env.CI_USER_TOKEN is unset');
  }

  async.series(steps, done);
}

exports['default'] = publish;
module.exports = exports['default'];