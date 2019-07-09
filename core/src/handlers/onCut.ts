import EditorState from "../EditorState";
import { removeRange } from '../commands'

export default function onCut(editorState: EditorState, event: ClipboardEvent) {
  event.preventDefault()
  document.execCommand('copy')
  return removeRange(editorState, editorState.start + 1, editorState.end + 1)
}