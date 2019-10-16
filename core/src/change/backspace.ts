import EditorState from '../EditorState'
import getIndexBefore from '../query/getIndexBefore'
import { COMMAND } from '../constants'

export default function backspace(
  editorState: EditorState,
  start: number,
  end: number
): EditorState {
  let newEditorState = editorState
  const previousCharIndex = getIndexBefore(editorState.list.value, start + 1, (ch) => {
    if (ch == null) {
      return false
    }

    return ch.type == null || ch.type === 'block-end';
  });

  if (previousCharIndex != null) {
    let _start = previousCharIndex - 1

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