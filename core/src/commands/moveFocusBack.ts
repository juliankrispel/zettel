import EditorState from '../EditorState'
import updateSelection from './updateSelection'
import getPreviousCharacterIndex from '../getPreviousCharacterIndex'

export default function moveFocusBack(editorState: EditorState): EditorState {
  const focusOffset = getPreviousCharacterIndex(editorState, editorState.focusOffset)
  return updateSelection(
    editorState,
    {
      anchorOffset: editorState.anchorOffset,
      focusOffset: focusOffset
    }
  )
}