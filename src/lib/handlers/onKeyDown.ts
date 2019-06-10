import getDomSelection from '../selection/getDomSelection'
import { ListState } from '../types';
import EditorState from '../EditorState';
const actionKeys = ['Backspace', 'Delete', 'Meta', 'Alt', 'Enter', 'Control', 'Shift', 'Tab', 'Escape', 'CapsLock']

const isCharacterInsert = (e: KeyboardEvent) =>
  !e.altKey &&
  !e.metaKey &&
  !e.ctrlKey &&
  !e.key.includes('Arrow') &&
  !actionKeys.includes(e.key)

const isCopy = (e: KeyboardEvent) => e.metaKey && e.key === 'c'
const isPaste = (e: KeyboardEvent) => e.metaKey && e.key === 'v'

const isUndo = (e: KeyboardEvent) => !e.shiftKey && e.metaKey && e.key === 'z'
const isRedo = (e: KeyboardEvent) => e.shiftKey && e.metaKey && e.key === 'z'

export default function handleKeyDown (editorState: EditorState, event: KeyboardEvent) {
  event.preventDefault()
  let newEditorState = editorState

  const position = getDomSelection(editorState.list)
  if (position === null) {
    console.warn('cant get start and end selection')
    return editorState
  }

  const [start, end] = position
  const isCollapsed = start === end

  if (isUndo(event)) {
  } else if (isRedo(event)) {
  } else if (event.key === 'Backspace' && event.metaKey === true) {
  } else if (event.key === 'Backspace' && event.altKey === true) {
  } else if (event.key === 'Backspace') {
    const change = {
      start,
      end,
      value: []
    }
    const changed = editorState.change(change)
    newEditorState = changed
  } else if (event.key === 'Enter') {
  } else if (event.key === 'Delete') {
  } else if (isCharacterInsert(event) && isCollapsed) {
  } else if (isCharacterInsert(event)) {
  } else if (isCopy(event)) {
  } else if (isPaste(event)) {
  }

  return newEditorState
}
