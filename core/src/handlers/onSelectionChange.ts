import EditorState from '../EditorState'
import { updateSelection } from '../change'
import { getDomRange } from '../selection'

export default function onSelectionChange(editorState: EditorState) {
  const result = getDomRange(editorState.list)

  if (result != null) {
    const { start, end } = result
    return updateSelection(
      editorState,
      {
        anchorOffset: start,
        focusOffset: end
      }
    )
  }
}