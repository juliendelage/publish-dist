import { readFileSync } from 'fs'
import { knownCommit } from './config'

const gitRawCommits = require('git-raw-commits')
const conventionalCommitsParser = require('conventional-commits-parser')

export default function (cb) {
  const rawOpts = {
    from: 'HEAD~1',
    to: 'HEAD'
  }

  const parseOpts = {
    headerCorrespondence: 'chore',
    noteKeywords: '--'
  }

  function handleError (err) {
    console.error(err.message)
    process.exit(1)
  }

  function parseCommit (chunk) {
    chunk = chunk.toString()
    const commit = conventionalCommitsParser.sync(chunk, parseOpts)
    if (!commit) {
      throw new Error('could not parse commit')
    }

    const matches = Object.keys(commit)
      .filter(key => key in knownCommit)
      .every(key => commit[key] === knownCommit[key])

    if (matches) {
      console.log('last commit by publish-dist; exiting')
      process.exit()
    }

    cb()
  }

  gitRawCommits(rawOpts)
    .on('error', handleError)
    .on('data', parseCommit)
}
