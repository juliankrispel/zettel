import getDomSelection from '../selection/getDomSelection'
import EditorState from '../EditorState'
import { COMMAND } from '../constants'
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