import EditorState from '../state'
import { COMMAND } from '../constants'

export default function removeRange(
  editorState: EditorState,
  start: number, 
  end: number
) {
  return editorState.change({
    isBoundary: true,
    type: COMMAND.REMOVE_RANGE,
    start,
    end,
    value: []
  }).change({
    type: COMMAND.REMOVE_RANGE,
    start,
    end: start,
    value: [],
  })
}