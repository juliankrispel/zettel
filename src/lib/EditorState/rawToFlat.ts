import { BlockStart, BlockEnd, Character, RawDocument, ListState } from '../types'
import id from './id'

const parseFlatState = (raw: RawDocument): ListState => {
  const state: ListState = {
    value: [],
    entityMap: raw.entityMap
  }

  let ignore = true

  raw.text.split('').forEach(char => {
    if (char === '[') {
      ignore = false

      const val: BlockStart = {
        type: 'block-start',
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
  })

  return state
}

export default parseFlatState