import EditorState from "../state";
import valueFromText from '../serialize/valueFromText'
import getDomSelection from "../selection/getDomSelection";

export default function onPaste(editorState: EditorState, event: ClipboardEvent) {
  const position = getDomSelection(editorState.list)

  if (position === null) {
    console.warn('cant get start and end selection')
    return editorState
  }

  event.preventDefault()

  const { start, end } = position

  if (event.clipboardData == null) {
    return editorState
  }

  const text = event.clipboardData.getData('text')
  const value = valueFromText(text)

  const changed = editorState.change({
    start,
    end,
    value,
  }).change({
    start: start + value.length,
    end: start + value.length,
    value: []
  })

  return changed
}