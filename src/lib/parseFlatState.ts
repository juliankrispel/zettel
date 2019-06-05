import { RawDocument, FlatState } from './types'

const parseFlatState = (raw: RawDocument): FlatState => {
  const state: FlatState = {
    value: [],
    meta: raw.meta
  }

  let ignore = true

  raw.text.split('').forEach(char =>{
    if (char === '[') {
      ignore = false
      state.value.push({
        char,
        styles: [],
      })
    } else if (char === ']') {
      ignore = true
      state.value.push({
        char,
        styles: [],
      })
    } else if (ignore === false) {
      state.value.push({
        char,
        styles: [],
      })
    }
  })

  return state
}

export default parseFlatState