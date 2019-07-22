import EditorState from '../EditorState'
import getIndexBefore from '../getIndexBefore';
import { COMMAND } from '../constants'

export default function backspaceToPrevWord(
  editorState: EditorState,
  start: number,
  end: number
): EditorState {
  let newEditorState = editorState
  const prevChar = editorState.list.value[start]

  if (prevChar.type == null) {
    let spaceBefore = false
    let isBlockStart = false
    const prevWordEnd = getIndexBefore(
      editorState.list.value,
      start,
      (ch) => {
        if (ch.type !== 'block-start' && ch.type !== 'block-end') {
          spaceBefore = ch.char === ' '
        }
        if (ch.type === 'block-start'){
          isBlockStart = true
          return true
        }
        if (ch.type == null && spaceBefore) {
          return true
        }
        return false
      }
    )

    if (prevWordEnd != null) {
      newEditorState = editorState.change({
        type: COMMAND.BACKSPACE_PREV_WORD,
        start: isBlockStart ? prevWordEnd + 1 : prevWordEnd,
        end,
        value: [],
        isBoundary: true
      })
    }
  }

  return newEditorState
}