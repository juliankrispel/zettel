import getDomSelection from '../selection/getDomSelection'
import EditorState from '../EditorState';
import {
  moveFocusBack,
  moveFocusForward,
  undo, 
  redo,
  updateSelection,
  backspaceToBlockStart,
  backspaceToPrevWord,
  backspace,
  removeRange,
  splitBlock,
  deleteForward,
  insertText,
  insertCharacter,
} from '../change'

// @ts-ignore
const inputEventSupported = (new InputEvent('insertText')).getTargetRanges != null
const actionKeys = ['Backspace', 'Delete', 'Meta', 'Alt', 'Enter', 'Control', 'Shift', 'Tab', 'Escape', 'CapsLock']

const isCharacterInsert = (e: KeyboardEvent) =>
  e.key !== 'Unidentified' &&
  !e.altKey &&
  !e.metaKey &&
  !e.ctrlKey &&
  !e.key.includes('Arrow') &&
  !actionKeys.includes(e.key)

const isMoveFocus = (e: KeyboardEvent) => e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)
const isSelectAll = (e: KeyboardEvent) => e.metaKey && e.key.toLowerCase() === 'a'
const isUndo = (e: KeyboardEvent) => !e.shiftKey && e.metaKey && e.key === 'z'
const isRedo = (e: KeyboardEvent) => e.shiftKey && e.metaKey && e.key === 'z'

export default function handleKeyDown (editorState: EditorState, event: KeyboardEvent): EditorState | void | null {
  // newEditorState is the value that gets returned by this function
  // if it is still undefined when being 'returned' no editor change should occur
  // and the event shouldn't be cancelled (i.e. no event.preventDefault())
  let newEditorState

  let position = getDomSelection(editorState.list)
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

  if (isUndo(event)) {
    // undo
    newEditorState = undo(editorState)
  } else if (isMoveFocus(event)) {
    if (event.key === 'ArrowLeft' && event.metaKey) {
      // move focus back to block start
    } else if (event.key === 'ArrowLeft' && event.altKey) {
      // move focus back to prev word
    } else if (event.key === 'ArrowLeft') {
      // move focus back to prev char
      newEditorState = moveFocusBack(editorState)
    } else if (event.key === 'ArrowRight' && event.metaKey) {
      // move focus forward to block end
    } else if (event.key === 'ArrowRight' && event.altKey) {
      // move focus forward to word end
    } else if (event.key === 'ArrowRight') {
      newEditorState = moveFocusForward(editorState)
    }

  } else if (isSelectAll(event)) {
    newEditorState = updateSelection(
      editorState,
      {
        start: 0,
        end: editorState.list.value.length - 2,
        anchorOffset: 0,
        focusOffset: editorState.list.value.length - 2
      }
    )
  } else if (isRedo(event)) {
    // redo
    newEditorState = redo(editorState)
  }
  
  if (event.key === 'Enter' && event.shiftKey) {
    // splitBlock
    newEditorState = insertCharacter(
      editorState,
      start,
      end,
      '\n'
    )
  }

  if (newEditorState == null && !inputEventSupported) {
    if (isCollapsed && event.key === 'Backspace' && event.metaKey === true) {
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
    }  else if (event.key === 'Enter') {
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

      newEditorState = insertCharacter(
        editorState,
        start,
        end,
        event.key
      )
    }
  }

  return newEditorState
}
