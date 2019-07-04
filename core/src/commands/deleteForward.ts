import EditorState from '../EditorState'
import { COMMAND } from '../constants'

export default function deleteForward(
  editorState: EditorState,
  start: number, 
  end: number
) {
  return editorState.change({
    isBoundary: editorState.lastChangeType !== COMMAND.DELETE_FORWARD,
    type: COMMAND.DELETE_FORWARD,
    start,
    end,
    value: []
  }).change({
    type: COMMAND.DELETE_FORWARD,
    start: end + 1,
    end: end + 1,
    value: [],
  })
}