import { BlockStart, Value, BlockEnd, Character, RawDocument, ListState, TextCharacter } from '../types'
import id from '../EditorState/id'

const fromRaw = (raw: RawDocument): Value => {
  const value: Value = []

  let ignore = true

  const text = raw.text

  for (let char of text) {
    if (char === '[') {
      ignore = false

      const val: BlockStart = {
        type: 'block-start',
        styles: [],
        blockKey: id()
      }
      value.push(val)
    } else if (char === ']') {
      ignore = true

      const val: BlockEnd = {
        type: 'block-end'
      }
      value.push(val)
    } else if (ignore === false) {
      const val: Character = {
        char,
        styles: [],
      }
      value.push(val)
    }
  }

  raw.ranges.forEach(({ offset, length, ...charData }) => {
    for (var i = offset; i < offset + length; i++) {
      const item = value[i]
      if ('char' in item || item.type === 'block-start') {
        const newValue = {
          ...item,
          ...charData,
        }

        value[i] = newValue
      }
    }
  })

  return value
}

export default fromRaw