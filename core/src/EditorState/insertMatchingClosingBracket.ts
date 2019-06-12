import { Value } from '../types'

const autoInsertClosingBracket = (_value: Value, startIndex: number) => {
  let value = [..._value]
  let index = startIndex
  let blockCount = 0

  for (let ch of value.slice(startIndex)) {
    if (ch.type != null) {
      if (ch.type === 'block-start') {
        blockCount++
      } else if (ch.type === 'block-end') {
        blockCount--
      }
    }

    index++

    if (blockCount < 0) {
      value.splice(index - 1, 0, { type: 'block-end' })
      break
    }
  }
  return value
}

export default autoInsertClosingBracket