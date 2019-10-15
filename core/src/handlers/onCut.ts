import EditorState from "../state";
import { removeRange } from '../change'

export default function onCut(editorState: EditorState, event: ClipboardEvent) {
  event.preventDefault()
  document.execCommand('copy')
  return removeRange(editorState, editorState.start, editorState.end)
}