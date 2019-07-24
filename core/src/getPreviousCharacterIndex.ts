import EditorState from './EditorState'
import getIndexBefore from './getIndexBefore'

export default function getNextCharacterIndex(editorState: EditorState, currIndex: number): number {
  const index = getIndexBefore(editorState.list.value, currIndex, ch => {
    return ch.type == null
  })

  if (index != null) {
    return index
  } else {
    return currIndex
  }
}