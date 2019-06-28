import EditorState from '../EditorState'

export default function undo(editorState: EditorState) {
  return editorState.undo()
}