import getDomSelection from '../selection/getDomSelection'
import { ListState } from '../types';
import EditorState from '../EditorState';
import id from '../EditorState/id';
import getBlockForIndex from '../getBlockForIndex'
import { blockStatement } from '@babel/types';
import textToFlat from '../textToFlat'
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
    newEditorState = editorState.undo()
  } else if (isRedo(event)) {
    event.preventDefault()
    newEditorState = editorState.redo()
  } else if (isCollapsed && event.key === 'Backspace' && event.metaKey === true) {
    event.preventDefault()
  } else if (isCollapsed && event.key === 'Backspace' && event.altKey === true) {
    event.preventDefault()
  } else if (event.key === 'Backspace' && isCollapsed) {
    event.preventDefault()
    const changed = editorState.change({
      start: start - 1,
      end,
      value: []
    }).change({
      start: start - 1,
      end: start - 1,
      value: []
    })
    newEditorState = changed
  } else if (event.key === 'Backspace' && !isCollapsed) {
    event.preventDefault()
    newEditorState = editorState.change({
      start,
      end,
      value: []
    }).change({
      start,
      end: start,
      value: []
    })
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const { block: currentBlock } = getBlockForIndex(editorState.list.value, start)
    const changed = editorState.change({
      start,
      end,
      value: [
        { type: 'block-end' },
        { ...currentBlock, type: 'block-start', blockKey: id()}
      ]
    }).change({
      start: end + 2,
      end: end + 2,
      value: []
    })
    newEditorState = changed
  } else if (event.key === 'Delete' && isCollapsed) {
    event.preventDefault()

    const change = {
      start,
      end,
      value: []
    }
    const changed = editorState.change(change)
    newEditorState = changed
  } else if (event.key === 'Delete') {
    event.preventDefault()
  } else if (isCharacterInsert(event)) {
    event.preventDefault()
    newEditorState = editorState.change({
      start,
      end,
      value: [{
        char: event.key,
        styles: []
      }]
    }).change({
      start: start + event.key.length,
      end: start + event.key.length,
      value: []
    })
  } else if (isCopy(event)) {
    // event.preventDefault()
    console.log('implement internal copy maybe?')
  } else if (isPaste(event)) {
    /*
    let _ev: any = event
    event.preventDefault()
    console.log(_ev.target.isPaste)
    */
  }

  return newEditorState
}
