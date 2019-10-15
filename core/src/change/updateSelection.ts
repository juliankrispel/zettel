import EditorState from '../state'
import { COMMAND } from '../constants'

type SelectionStateUpdate = {
  start?: number,
  end?: number
  anchorOffset: number,
  focusOffset: number
}

export default function updateSelection(
  editorState: EditorState,
  selection: SelectionStateUpdate
): EditorState {
  return new EditorState({
    lastChangeType: COMMAND.CHANGE_SELECTION,
    ...editorState,
    ...selection
  })
}