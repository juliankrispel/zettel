import { BlockStart, BlockEnd, Character, RawDocument, ListState, TextCharacter } from '../types'
import id from '../EditorState/id'

const fromRaw = (raw: RawDocument): ListState => {
  const state: ListState = {
    value: []
  }

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
      state.value.push(val)
    } else if (char === ']') {
      ignore = true

      const val: BlockEnd = {
        type: 'block-end'
      }
      state.value.push(val)
    } else if (ignore === false) {
      const val: Character = {
        char,
        styles: [],
      }
      state.value.push(val)
    }
  }

  raw.ranges.forEach(({ offset, length, ...charData }) => {
    for (var i = offset; i < offset + length; i++) {
      const value = state.value[i]
      if ('char' in value || value.type === 'block-start') {
        const newValue = {
          ...value,
          ...charData,
        }

        // @ts-ignore
        state.value[i] = newValue
      }
    }
  })

  return state
}

export default fromRaw