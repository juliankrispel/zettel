import EditorState from '../EditorState'
import getIndexBefore from '../getIndexBefore'
import { COMMAND } from '../constants'

export default function backspace(
  editorState: EditorState,
  start: number,
  end: number
) {
  let newEditorState
  const previousCharIndex = getIndexBefore(editorState.list.value, start, (ch) => ch.type == null || ch.type === 'block-end')

  if (previousCharIndex != null) {
    let _start = previousCharIndex


    newEditorState = editorState.change({
      isBoundary: editorState.lastChangeType !== COMMAND.BACKSPACE,
      type: COMMAND.BACKSPACE,
      start: _start,
      end,
      value: []
    }).change({
      type: COMMAND.BACKSPACE,
      start: _start,
      end: _start,
      value: [],
    })
  }

  return newEditorState
}