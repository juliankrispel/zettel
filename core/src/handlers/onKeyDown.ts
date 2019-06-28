import getDomSelection from '../selection/getDomSelection'
import EditorState from '../EditorState';
import {
  deleteForward,
  insertCharacter,
  splitBlock,
  removeRange,
  undo,
  redo,
  backspaceToBlockStart,
  backspaceToPrevWord,
  backspace
} from '../commands'

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

export default function handleKeyDown (editorState: EditorState, event: KeyboardEvent): EditorState | void {
  // newEditorState is the value that gets returned by this function
  // if it is still undefined when being 'returned' no editor change should occur
  // and the event shouldn't be cancelled (i.e. no event.preventDefault())
  let newEditorState

  const position = getDomSelection(editorState.list)
  if (position === null) {
    console.error('cant get start and end selection')
    return editorState
  }

  const [start, end] = position
  const isCollapsed = start === end

  if (isUndo(event)) {
    // undo
    newEditorState = undo(editorState)
  } else if (isRedo(event)) {
    // redo
    newEditorState = redo(editorState)
  } else if (isCollapsed && event.key === 'Backspace' && event.metaKey === true) {
    // backspaceToBlockStart
    newEditorState = backspaceToBlockStart(editorState, start, end)
  } else if (isCollapsed && event.key === 'Backspace' && event.altKey === true) {
    // backspaceToPrevWord
    newEditorState = backspaceToPrevWord(editorState, start, end)
  } else if (event.key === 'Backspace' && isCollapsed) {
    // backspace
    newEditorState = backspace(editorState, start, end)
  } else if (event.key === 'Backspace' && !isCollapsed) {
    // removeRange
    newEditorState = removeRange(editorState, start, end)
  } else if (event.key === 'Enter') {
    // splitBlock
    newEditorState = splitBlock(editorState, start, end)
  } else if (event.key === 'Delete' && isCollapsed) {
    // deleteForward
    newEditorState = deleteForward(editorState, start, end)
  } else if (event.key === 'Delete' && !isCollapsed) {
    // removeRange
    newEditorState = removeRange(editorState, start, end)
  } else if (isCharacterInsert(event)) {
    // insertCharacter
    newEditorState = insertCharacter(editorState, start, end, event.key)
  }

  return newEditorState
}
