import EditorState from "../EditorState";
import {
  backspaceToBlockStart,
  backspaceToPrevWord,
  backspace,
  removeRange,
  deleteForward,
  insertText,
  splitBlock,
} from '../change'
import getDomRange from "../selection/getDomRange";

type InputEvent = Event & {
  readonly data?: string;
  readonly inputType?: string
}

export default function onBeforeInput(editorState: EditorState, _event: any) {
  const event: InputEvent = _event
  let newEditorState = editorState
  const domRange = getDomRange(editorState.list)

  console.log(event, domRange)

  if (domRange == null) return newEditorState

  const { collapsed, start, end } = domRange

  event.preventDefault()
  event.stopPropagation()

  if (event.inputType === 'insertText') {
    newEditorState = insertText(newEditorState, start, end, event.data || '')
  } else if (event.inputType === 'insertFromPaste') {
    newEditorState = insertText(newEditorState, start, end, event.data || '')
  } else if (event.inputType === 'insertCompositionText') {
    newEditorState = insertText(newEditorState, start, start, event.data || '')
  } else if (event.inputType === 'insertLineBreak') {
    newEditorState = splitBlock(newEditorState, start, end)
  } else if (!collapsed && event.inputType === 'deleteContentBackward') {
    newEditorState = removeRange(editorState, start, end)
  } else if (event.inputType === 'deleteContentBackward') {
    newEditorState = backspace(editorState, start, end)
  } else if (event.inputType === 'deleteWordBackward') {
    newEditorState = backspaceToPrevWord(editorState, start, end)
  } else if (event.inputType === 'deleteSoftLineBackward') {
    newEditorState = backspaceToBlockStart(editorState, start, end)
  } else if (event.inputType === 'deleteContentForward') {
    newEditorState = deleteForward(editorState, start, end)
  }

  return newEditorState
}