import EditorState from '../EditorState'
import getIndexBefore from '../query/getIndexBefore';
import { COMMAND } from '../constants'
import { TextCharacter, Character } from '../types';

export default function backspaceToPrevWord(
  editorState: EditorState,
  start: number,
  end: number
): EditorState {
  let newEditorState = editorState
  const prevChar = editorState.list.value[start]

  if ('char' in prevChar) {
    let spaceBefore = false
    let isBlockStart = false
    const prevWordEnd = getIndexBefore(
      editorState.list.value,
      start,
      (ch) => {
        if ('char' in ch) {
          spaceBefore = ch.char === ' '
        }
        if ('type' in ch && ch.type === 'block-start'){
          isBlockStart = true
          return true
        }
        if ('char' in ch && spaceBefore) {
          return true
        }
        return false
      }
    )

    if (prevWordEnd != null) {
      newEditorState = editorState.change({
        type: COMMAND.BACKSPACE_PREV_WORD,
        start: isBlockStart ? prevWordEnd : prevWordEnd,
        end,
        value: [],
        isBoundary: true
      })
    }
  }

  return newEditorState
}