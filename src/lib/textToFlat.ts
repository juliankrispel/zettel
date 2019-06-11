import { BlockStart, BlockEnd, Character, RawDocument, ListState } from './types'
import id from './EditorState/id'
import raw from './rawToFlat'

const textToFlat = (text: string): ListState => {
  return raw({
    text: `[${text.replace('\n', '][')}]`,
    ranges: [],
    entityMap: {}
  })

}

export default textToFlat