import { Value } from '../types'
import id from './id'

const insertMatchingOpeningBracket = (_value: Value, startIndex: number) => {
  let value = [..._value]
  let blockCount = 0

  for (let index = startIndex; index >= 0; index--) {
    const ch = value[index]

    if (ch.type != null) {
      if (ch.type === 'block-end') {
        blockCount++
      } else if (ch.type === 'block-start') {
        blockCount--
      }
    }

    if (blockCount < 0 || index === 0) {
      value.splice(index + 1, 0, { type: 'block-start', blockKey: id() })
      return value
    }
  }

  return value
}

export default insertMatchingOpeningBracket