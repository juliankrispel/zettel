import EditorState from '../EditorState'
import getIndexAfter from './getIndexAfter'

export default function getNextCharacterIndex(editorState: EditorState, currIndex: number): number {
  const index = getIndexAfter(editorState.list.value, currIndex, ch => {
    return 'char' in ch
  })

  if (index != null) {
    return index
  } else {
    return currIndex
  }
}