import EditorState from '../EditorState'
import getIndexBefore from '../getIndexBefore';

export default function backspaceToBlockStart(
  editorState: EditorState,
  start: number,
  end: number
) {
  const prevChar = editorState.list.value[start - 1]
  let newEditorState

  if (prevChar.type == null) {
    const blockBeginning = getIndexBefore(
      editorState.list.value,
      start,
      (ch) => {
        if (ch.type === 'block-start'){
          return true
        }
        return false
      }
    )

    if (blockBeginning != null) {
      newEditorState = editorState.change({
        start: blockBeginning + 1,
        end,
        value: []
      })
    }
  }

  return newEditorState
}