import EditorState from '../EditorState'
import { TextCharacter } from '../types'

export default function toText(editorState: EditorState) {
  return editorState
  
  .value
  .filter(ch => 'char' in ch || ch.type !== 'block-end')
  .map((ch, index) => {
    if ('char' in ch) {
      return ch.char
    } else if (ch.type == 'block-start' && index !== 0){
      return '\n'
    } else {
      return ''
    }
  }).join('')
}