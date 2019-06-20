import getDomSelection from '../selection/getDomSelection'
import EditorState from '../EditorState'

export default function onSelectionChange(editorState: EditorState) {
  const result = getDomSelection(editorState.list)

  if (result != null) {

    return new EditorState({
      ...editorState,
      start: result[0] - 1,
      end: result[1] - 1,
    })
  }
}