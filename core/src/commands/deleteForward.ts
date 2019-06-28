import EditorState from '../EditorState'

export default function deleteForward(
  editorState: EditorState,
  start: number, 
  end: number
) {
  return editorState.change({
    start,
    end,
    value: []
  }).change({
    start: end + 1,
    end: end + 1,
    value: []
  })
}