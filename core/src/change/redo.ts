import EditorState from '../EditorState'
import { Changes, Change } from '../types';
import { COMMAND } from '../constants'
import change from './change'

export default function redo(editorState: EditorState): EditorState {
  if (editorState.redoStack.length === 0) {
    return editorState
  }

  const emptyChange: Changes = []

  let newEditorState = new EditorState({
    start: editorState.start,
    end: editorState.end,
    value: editorState.value,
    redoStack: editorState.redoStack,
    undoStack: [emptyChange].concat([...editorState.undoStack])
  })

  const [lastChanges, ...rest] = editorState.redoStack
  // @ts-ignore
  newEditorState = lastChanges.reduce((editorState: EditorState, lastChange: Change) => {
    const updated = change({
      value: editorState.value,
      change: {
        ...lastChange,
        start: lastChange.start - 1,
        end: lastChange.end - 1,
      }
    })

    const [lastUndo, ...undoStack] = editorState.undoStack

    return new EditorState({
      start: updated.change.start,
      end: updated.change.end,
      value: updated.value,
      redoStack: rest,
      undoStack: [[updated.change].concat(lastUndo || [])].concat(undoStack),
    })
  }, newEditorState)

  return new EditorState({
    start: newEditorState.start - 1,
    lastChangeType: COMMAND.REDO,
    end: newEditorState.end - 1,
    value: newEditorState.value,
    redoStack: newEditorState.redoStack,
    undoStack: newEditorState.undoStack
  })
}