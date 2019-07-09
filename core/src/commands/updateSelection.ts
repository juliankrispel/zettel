import EditorState from '../EditorState'
import getIndexBefore from '../getIndexBefore'
import { COMMAND } from '../constants'

export default function updateSelection(
  editorState: EditorState,
  start: number,
  end: number
): EditorState {
  return new EditorState({
    lastChangeType: COMMAND.CHANGE_SELECTION,
    ...editorState,
    start: start,
    end: end
  })
}