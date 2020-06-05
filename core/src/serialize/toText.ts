import EditorState from '../EditorState'
import { TextCharacter } from '../types'

export default function toText(editorState: EditorState) {
  return editorState
  
  .value
  .filter(ch => 'char' in ch || ch.type !== 'block-end')
  .map(ch => {
    if ('char' in ch) {
      return ch.char
    } else {
      return '\n'
    }
  }).join('')
}