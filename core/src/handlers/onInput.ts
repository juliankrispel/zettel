import EditorState from "../EditorState";
import valueFromText from '../valueFromText'
import { insertCharacter } from '../commands'
import getDomSelection from "../selection/getDomSelection";
import getDomRange from "../selection/getDomRange";

type InputEvent = Event & {
  readonly data?: string;
  readonly inputType?: string
}

export default function onInput(editorState: EditorState, _event: any) {
  const event: InputEvent = _event
  let newEditorState = editorState
  const domRange = getDomRange(editorState.list)

  if (domRange == null) return newEditorState

  const { start, end } = domRange

  event.preventDefault()
  event.stopPropagation()

  console.log(event.inputType)
  if (event.inputType === 'insertText') {
    console.log('insert character', { start, end, data: event.data })
    console.log(event.data)
    newEditorState = insertCharacter(newEditorState, start, end, event.data || '')
  }

  return newEditorState
}