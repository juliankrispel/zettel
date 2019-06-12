import EditorState from "../EditorState";
import valueFromText from '../valueFromText'
import getDomSelection from "../selection/getDomSelection";

export default function onPaste(editorState: EditorState, event: ClipboardEvent) {
  const position = getDomSelection(editorState.list)

  if (position === null) {
    console.warn('cant get start and end selection')
    return editorState
  }

  event.preventDefault()

  const [start, end] = position.sort((a, b) => a - b)

  if (event.clipboardData == null) {
    return editorState
  }

  const text = event.clipboardData.getData('text')

  const changed = editorState.change({
    start,
    end,
    value: valueFromText(text),
  }).change({
    start,
    end: start,
    value: []
  })

  return changed
}