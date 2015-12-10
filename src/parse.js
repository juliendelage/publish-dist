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

  let rawCommit = ''

  function handleError (err) {
    console.error(err.message)
    process.exit(1)
  }

  function pushChunk (chunk) {
    rawCommit = chunk.toString()
  }

  function parseCommit () {
    if (!rawCommit) {
      throw new Error('could not find last commit')
    }

    const commit = conventionalCommitsParser.sync(rawCommit, parseOpts)
    if (!commit) {
      throw new Error('could not parse commit')
    }

    const matches = Object.keys(commit)
      .filter(key => key in knownCommit)
      .every(key => {
        if (Array.isArray(knownCommit[key])) {
          return knownCommit[key].some(v => v === commit[key])
        } else {
          return commit[key] === knownCommit[key]
        }
      })

    if (matches) {
      console.log('last commit by publish-dist; exiting')
      process.exit()
    }

    cb()
  }

  gitRawCommits(rawOpts)
    .on('error', handleError)
    .on('data', pushChunk)
    .on('close', parseCommit)
}
