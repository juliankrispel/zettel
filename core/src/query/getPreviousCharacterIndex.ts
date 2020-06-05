import EditorState from '../EditorState'
import getIndexBefore from './getIndexBefore'

export default function getNextCharacterIndex(editorState: EditorState, currIndex: number): number {
  const index = getIndexBefore(editorState.value, currIndex, ch => {
    return 'char' in ch
  })

  if (index != null) {
    return index
  } else {
    return currIndex
  }
}