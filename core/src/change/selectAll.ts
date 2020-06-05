import EditorState from '../state'
import updateSelection from './updateSelection'

export default function selectAll(editorState: EditorState): EditorState {
  return updateSelection(
    editorState,
    {
      start: 0,
      end: editorState.value.length - 2,
      anchorOffset: 0,
      focusOffset: editorState.value.length - 2
    }
  )
}