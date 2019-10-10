import EditorState from "../EditorState";
import valueFromText from '../valueFromText'
import { insertCharacter } from '../commands'
import getDomSelection from "../selection/getDomSelection";

type InputEvent = Event & {
  readonly data?: string;
  readonly inputType?: string
}

export default function onInput(editorState: EditorState, _event: any) {
  const event: InputEvent = _event
  let newEditorState = editorState
  let position = getDomSelection(editorState.list)

  console.log({ position })

  if (position === null) {
    console.warn('cant get start and end selection, resume with current state')
    position  = {
      start: editorState.start,
      end: editorState.end,
      anchorOffset: editorState.anchorOffset,
      focusOffset: editorState.focusOffset
    }
  }

  const { start, end } = position
  const isCollapsed = start === end

  if (event.type === 'textInput' && !isCollapsed) {
    newEditorState = insertCharacter(
      editorState,
      start,
      end,
      event.data || ''
    )
  }

  return newEditorState
}