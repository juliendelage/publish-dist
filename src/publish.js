import { readFileSync, appendFile } from 'fs'
import { exec } from 'child_process'
import { knownCommit } from './config'

const pkg = JSON.parse(readFileSync('./package.json'))
const opts = require('./opts')()
const async = require('async')
const osHomedir = require('os-homedir')
const parseAuthor = require('parse-author')

function add (cb) {
  const cmd = 'git add dist'
  exec(cmd, cb)
}

function configName (cb) {
  const name = opts.flags.authorName || parseAuthor(pkg.author).name
  const cmd = `git config user.name "${name}"`
  exec(cmd, cb)
}

function configEmail (cb) {
  const email = opts.flags.authorEmail || parseAuthor(pkg.author).email
  const cmd = `git config user.email "${email}"`
  exec(cmd, cb)
}

function commit (cb) {
  const cmd = [
    'git commit dist',
    opts.flags.skipHooks === true ? '--no-verify' : '',
    `--message "${knownCommit.header[opts.flags.skipCi === true ? 1 : 0]}"`,
    `--message "${knownCommit.body}\n\n${knownCommit.footer}"`
  ].join(' ')
  exec(cmd, cb)
}

function netrc (cb) {
  const host = `machine github.com\n  login ${process.env.CI_USER_TOKEN}\n`
  const netrc = `${osHomedir()}/.netrc`
  appendFile(netrc, host, cb)
}

function push (cb) {
  const cmd = [
    'git push',
    opts.flags.skipHooks === true ? '--no-verify' : '',
    'origin HEAD:master'
  ].join(' ')
  exec(cmd, cb)
}

function publish () {
  const steps = [
    add,
    configName,
    configEmail,
    commit,
    netrc,
    push
  ]

  function done (err) {
    if (err) {
      throw err
    }
    console.log('A new build has been pushed. You can ignore the next error :)')
    process.exit(1)
  }

  if (!process.env.CI_USER_TOKEN) {
    throw new Error('process.env.CI_USER_TOKEN is unset')
  }

  async.series(steps, done)
}

export default publish
