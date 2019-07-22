import getDomSelection from '../selection/getDomSelection'
import EditorState from '../EditorState'
import { COMMAND } from '../constants'
import { updateSelection } from '../commands'

export default function onSelectionChange(editorState: EditorState) {
  const result = getDomSelection(editorState.list)

  if (result != null) {
    return updateSelection(
      editorState,
      result
    )
  }
}