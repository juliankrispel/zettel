import EditorState from "../EditorState";
import valueFromText from '../valueFromText'
import getDomSelection from "../selection/getDomSelection";

type InputEvent = Event & {
  readonly data?: string;
  readonly inputType?: string
}

export default function onInput(editorState: EditorState, _event: any) {
  const event: InputEvent = _event
  const position = getDomSelection(editorState.list)

  if (position === null) {
    console.warn('cant get start and end selection')
    return editorState
  }

  event.preventDefault()

  const { start, end } = position

  if (event.inputType !== 'insertText' || event.data == null) {
    return editorState
  }

  const text = event.data

  const changed = editorState.change({
    start: start - 2,
    end: start,
    value: valueFromText(text),
  }).change({
    start: + 1,
    end: start + 1,
    value: []
  })

  return changed
}