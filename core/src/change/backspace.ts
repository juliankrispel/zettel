import EditorState from '../EditorState'
import getIndexBefore from '../query/getIndexBefore'
import { COMMAND } from '../constants'

export default function backspace(
  editorState: EditorState,
  start: number,
  end: number
): EditorState {
  let newEditorState = editorState

  const previousCharIndex = getIndexBefore(editorState.value, start, (ch, index) => {
    if (ch == null) {
      return false
    }

    if ('char' in ch) {
      return true
    }

    if ('fragment-end' === ch.type) {
      return true
    }

    if ('block-start' === ch.type) {
      return true
    }

    if (index === 0) {
      return true
    }
  });
//  console.log(newEditorState.start)
//  console.log(previousCharIndex)

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

//  console.log({ newEditorState })

  return newEditorState
}