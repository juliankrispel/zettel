import EditorState from '../EditorState'
import getIndexBefore from '../getIndexBefore';

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
      start: _start,
      end,
      value: []
    }).change({
      start: _start,
      end: _start,
      value: []
    })
  }

  return newEditorState
}