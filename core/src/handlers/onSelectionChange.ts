import getDomSelection from '../selection/getDomSelection'
import EditorState from '../state'
import { COMMAND } from '../constants'
import { updateSelection } from '../change'

export default function onSelectionChange(editorState: EditorState) {
  const result = getDomSelection(editorState.list)

  if (result != null) {
    return updateSelection(
      editorState,
      result
    )
  }
}