import EditorState from '../state'
import getIndexAfter from './getIndexAfter'

export default function getNextCharacterIndex(editorState: EditorState, currIndex: number): number {
  const index = getIndexAfter(editorState.list.value, currIndex, ch => {
    return ch.type == null
  })

  if (index != null) {
    return index
  } else {
    return currIndex
  }
}