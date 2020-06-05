import EditorState from '../EditorState'
import getIndexBefore from '../query/getIndexBefore';
import { COMMAND } from '../constants'

export default function backspaceToBlockStart(
  editorState: EditorState,
  start: number,
  end: number
): EditorState {
  const prevChar = editorState.value[start - 1]
  let newEditorState = editorState

  if ('char' in prevChar) {
    const blockBeginning = getIndexBefore(
      editorState.value,
      start,
      (ch) => {
        if ('type' in ch && ch.type === 'block-start'){
          return true
        }
        return false
      }
    )

    if (blockBeginning != null) {
      newEditorState = editorState.change({
        type: COMMAND.BACKSPACE_BLOCK_START,
        start: blockBeginning + 1,
        end,
        value: [],
        isBoundary: true
      })
    }
  }

  return newEditorState
}