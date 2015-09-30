import parse from './parse'
import publish from './publish'

export default function () {
  require('./opts')()
  parse(publish)
}
