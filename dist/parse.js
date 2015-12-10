'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _config = require('./config');

var gitRawCommits = require('git-raw-commits');
var conventionalCommitsParser = require('conventional-commits-parser');

exports['default'] = function (cb) {
  var rawOpts = {
    from: 'HEAD~1',
    to: 'HEAD'
  };

  var parseOpts = {
    headerCorrespondence: 'chore',
    noteKeywords: '--'
  };

  var rawCommit = '';

  function handleError(err) {
    console.error(err.message);
    process.exit(1);
  }

  function pushChunk(chunk) {
    rawCommit = chunk.toString();
  }

  function parseCommit() {
    if (!rawCommit) {
      throw new Error('could not find last commit');
    }

    var commit = conventionalCommitsParser.sync(rawCommit, parseOpts);
    if (!commit) {
      throw new Error('could not parse commit');
    }

    var matches = Object.keys(commit).filter(function (key) {
      return key in _config.knownCommit;
    }).every(function (key) {
      if (Array.isArray(_config.knownCommit[key])) {
        return _config.knownCommit[key].some(function (v) {
          return v === commit[key];
        });
      } else {
        return commit[key] === _config.knownCommit[key];
      }
    });

    if (matches) {
      console.log('last commit by publish-dist; exiting');
      process.exit();
    }

    cb();
  }

  gitRawCommits(rawOpts).on('error', handleError).on('data', pushChunk).on('close', parseCommit);
};

module.exports = exports['default'];