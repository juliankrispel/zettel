import EditorState from '../EditorState'
import updateSelection from './updateSelection'
import getNextCharacterIndex from '../query/getNextCharacterIndex'

export default function moveFocusForward(editorState: EditorState): EditorState {
  return updateSelection(
    editorState,
    {
      anchorOffset: editorState.anchorOffset,
      focusOffset: getNextCharacterIndex(editorState, editorState.focusOffset)
    }
  )
}