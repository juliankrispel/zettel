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
  let newEditorState = editorState

  const position = getDomSelection(editorState.list)
  if (position === null) {
    console.warn('cant get start and end selection')
    return editorState
  }

  const [start, end] = position
  const isCollapsed = start === end

  if (isUndo(event)) {
    event.preventDefault()
  } else if (isRedo(event)) {
    event.preventDefault()
  } else if (event.key === 'Backspace' && event.metaKey === true) {
    event.preventDefault()
  } else if (event.key === 'Backspace' && event.altKey === true) {
    event.preventDefault()
  } else if (event.key === 'Backspace') {
    event.preventDefault()
    const change = {
      start,
      end,
      value: []
    }
    const changed = editorState.change(change)
    newEditorState = changed
  } else if (event.key === 'Enter') {
    event.preventDefault()
  } else if (event.key === 'Delete') {
    event.preventDefault()
  } else if (isCharacterInsert(event) && isCollapsed) {
    event.preventDefault()
  } else if (isCharacterInsert(event)) {
    event.preventDefault()
  } else if (isCopy(event)) {
    event.preventDefault()
  } else if (isPaste(event)) {
    event.preventDefault()
  }

  return newEditorState
}
