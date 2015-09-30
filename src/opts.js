const meow = require('meow')

let cache

export default function () {
  if (cache) {
    return cache
  }
  const opts = {
    pkg: '../package.json'
  }
  cache = meow(opts)
  return cache
}
