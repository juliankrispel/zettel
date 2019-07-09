import EditorState from "../EditorState";
import valueFromText from '../valueFromText'
import { removeRange } from '../commands'
import getDomSelection from "../selection/getDomSelection";

export default function onCut(editorState: EditorState, event: KeyboardEvent) {
  event.preventDefault()
  document.execCommand('copy')
  return removeRange(editorState, editorState.start + 1, editorState.end + 1)
}