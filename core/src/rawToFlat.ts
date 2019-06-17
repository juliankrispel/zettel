import { BlockStart, BlockEnd, Character, RawDocument, ListState, TextCharacter } from './types'
import id from './EditorState/id'

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

  raw.ranges.forEach(({ offset, length, entity: entityKey, ...charData }) => {
    for (var i = offset; i < offset + length; i++) {
      const value = state.value[i]
      if (value.type == null || value.type === 'block-start') {
        const entity: string | null = (entityKey != null && state.entityMap[entityKey]) ? entityKey : null
        const newValue = {
          ...value,
          ...charData,
        }

        if (entity != null) {
          newValue.entity = entity
        }

        state.value[i] = newValue
      }
    }
  })

  return state
}

export default parseFlatState