import EditorState from '../EditorState'
import change from './change'
import { COMMAND } from '../constants'
import { Changes, Change } from '../types';

export default function undo(editorState: EditorState): EditorState {
  if (editorState.undoStack.length === 0) {
    return editorState
  }

  const [lastChanges, ...rest] = editorState.undoStack
  const emptyChange: Changes = []
  
  let newEditorState: EditorState = new EditorState({
    start: editorState.start,
    end: editorState.end,
    value: editorState.value,
    redoStack: [emptyChange].concat([...editorState.redoStack]),
    undoStack: editorState.undoStack
  })

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

    const [lastRedo, ...redoStack] = editorState.redoStack

    return new EditorState({
      start: updated.change.start,
      end: updated.change.end,
      value: updated.value,
      redoStack: [[updated.change].concat(lastRedo || [])].concat(redoStack),
      undoStack: rest
    })
  }, newEditorState)

  return new EditorState({
    start: newEditorState.start - 1,
    lastChangeType: COMMAND.UNDO,
    end: newEditorState.end - 1,
    value: newEditorState.value,
    redoStack: newEditorState.redoStack,
    undoStack: newEditorState.undoStack
  })
}