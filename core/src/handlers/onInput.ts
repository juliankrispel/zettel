import EditorState from "../state";
import valueFromText from '../serialize/valueFromText'
import { insertCharacter } from '../change'
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

  console.log({ inputType: event.inputType, start, end, data: event.data })
  if (event.inputType === 'insertText') {
    newEditorState = insertCharacter(newEditorState, start, end, event.data || '')
  } else if (event.inputType === 'insertLineBreak') {

  }

  return newEditorState
}