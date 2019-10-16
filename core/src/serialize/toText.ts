import EditorState from '../EditorState'
import { TextCharacter } from '../types'

export default function toText(editorState: EditorState) {
  return editorState
  .list
  .value
  .filter(ch => ch.type !== 'block-end')
  .map(ch => {
    if (ch.type == null) {
      const text = ch as TextCharacter
      return text.char
    } else {
      return '\n'
    }
  }).join('')
}