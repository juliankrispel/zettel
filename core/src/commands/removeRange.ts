import EditorState from '../EditorState'

export default function removeRange(
  editorState: EditorState,
  start: number, 
  end: number
) {
  return editorState.change({
    start,
    end,
    value: []
  }).change({
    start,
    end: start,
    value: []
  })
}