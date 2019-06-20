import getDomSelection from '../selection/getDomSelection'
import EditorState from '../EditorState';
import id from '../EditorState/id';
import getBlockForIndex from '../getBlockForIndex'
import getIndexBefore from '../getIndexBefore';
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
    newEditorState = editorState.undo()
  } else if (isRedo(event)) {
    newEditorState = editorState.redo()
  // backspaceToBlockStart
  } else if (isCollapsed && event.key === 'Backspace' && event.metaKey === true) {
    const prevChar = editorState.list.value[start - 1]

    if (prevChar.type == null) {
      const blockBeginning = getIndexBefore(
        editorState.list.value,
        start,
        (ch) => {
          if (ch.type === 'block-start'){
            return true
          }
          return false
        }
      )

      if (blockBeginning != null) {
        newEditorState = editorState.change({
          start: blockBeginning + 1,
          end,
          value: []
        })
      }
    }
  // backspaceToPrevWord
  } else if (isCollapsed && event.key === 'Backspace' && event.altKey === true) {
    const prevChar = editorState.list.value[start - 1]

    if (prevChar.type == null) {
      let spaceBefore = false
      let isBlockStart = false
      const prevWordEnd = getIndexBefore(
        editorState.list.value,
        start,
        (ch) => {
          if (ch.type !== 'block-start' && ch.type !== 'block-end') {
            spaceBefore = ch.char === ' '
          }
          if (ch.type === 'block-start'){
            isBlockStart = true
            return true
          }
          if (ch.type == null && spaceBefore) {
            return true
          }
          return false
        }
      )
      if (prevWordEnd != null) {
        newEditorState = editorState.change({
          start: isBlockStart ? prevWordEnd + 1 : prevWordEnd,
          end,
          value: []
        })
      }
    }
  } else if (event.key === 'Backspace' && isCollapsed) {
    const previousCharIndex = getIndexBefore(editorState.list.value, start, (ch) => ch.type == null || ch.type === 'block-end')

    if (previousCharIndex != null) {
      let _start = previousCharIndex

      newEditorState = editorState.change({
        start: _start,
        end,
        value: []
      }).change({
        start: _start,
        end: _start,
        value: []
      })
    }

  } else if (event.key === 'Backspace' && !isCollapsed) {
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
    const { block: currentBlock } = getBlockForIndex(editorState.list.value, start)
    const changed = editorState.change({
      start,
      end,
      value: [
        { type: 'block-end' },
        { ...currentBlock, type: 'block-start', blockKey: id()}
      ]
    }).change({
      start: end + 1,
      end: end + 1,
      value: []
    })
    newEditorState = changed
  } else if (event.key === 'Delete' && isCollapsed) {

    const change = {
      start,
      end,
      value: []
    }
    const changed = editorState.change(change)
    newEditorState = changed
  } else if (event.key === 'Delete') {
  } else if (isCharacterInsert(event)) {
    const prevValue = editorState.list.value[start - 1]
    const nextValue = editorState.list.value[end + 1]
    let entity = null

    // TODO: Write some tests for this
    // Basically only when we're inside an entity
    // as in next and prev value are contained within the same entity
    // shall we include this inserted value in this entity
    if (
      nextValue != null && nextValue.type == null
      && prevValue != null && prevValue.type == null
      && prevValue.entity === nextValue.entity) {
      entity = nextValue.entity
    }

    newEditorState = editorState.change({
      start,
      end,
      value: [{
        char: event.key,
        styles: editorState.currentStyles,
        entity,
      }]
    }).change({
      start: start,
      end: start,
      value: []
    })
  }

  return newEditorState
}
