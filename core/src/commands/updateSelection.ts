import EditorState from '../EditorState'
import { SelectionState } from '../types'
import { COMMAND } from '../constants'

export default function updateSelection(
  editorState: EditorState,
  selection: SelectionState
): EditorState {
  return new EditorState({
    lastChangeType: COMMAND.CHANGE_SELECTION,
    ...editorState,
    ...selection
  })
}