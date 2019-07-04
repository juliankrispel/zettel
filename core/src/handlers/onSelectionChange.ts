import getDomSelection from '../selection/getDomSelection'
import EditorState from '../EditorState'
import { COMMAND } from '../constants'

export default function onSelectionChange(editorState: EditorState) {
  const result = getDomSelection(editorState.list)

  if (result != null) {

    return new EditorState({
      lastChangeType: COMMAND.CHANGE_SELECTION,
      ...editorState,
      start: result[0] - 1,
      end: result[1] - 1,
    })
  }
}