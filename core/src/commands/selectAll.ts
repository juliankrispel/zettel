import EditorState from '../EditorState'
import updateSelection from './updateSelection'

export default function selectAll(editorState: EditorState): EditorState {
  return updateSelection(
    editorState,
    {
      start: 0,
      end: editorState.list.value.length - 2,
      anchorOffset: 0,
      focusOffset: editorState.list.value.length - 2
    }
  )
}