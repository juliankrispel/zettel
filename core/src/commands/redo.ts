import EditorState from '../EditorState'
import { Changes, change, Change } from '..';
import { COMMAND } from '../constants'

export default function redo(editorState: EditorState): EditorState {
  if (editorState.redoStack.length === 0) {
    return editorState
  }

  const emptyChange: Changes = []

  let newEditorState = new EditorState({
    start: editorState.start,
    end: editorState.end,
    list: editorState.list,
    redoStack: editorState.redoStack,
    undoStack: [emptyChange].concat([...editorState.undoStack])
  })

  const [lastChanges, ...rest] = editorState.redoStack
  newEditorState = lastChanges.reduce((editorState: EditorState, lastChange: Change) => {
    const updated = change({
      current: editorState.list,
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
      list: updated.current,
      redoStack: rest,
      undoStack: [[updated.change].concat(lastUndo || [])].concat(undoStack),
    })
  }, newEditorState)

  return new EditorState({
    start: newEditorState.start - 1,
    lastChangeType: COMMAND.REDO,
    end: newEditorState.end - 1,
    list: newEditorState.list,
    redoStack: newEditorState.redoStack,
    undoStack: newEditorState.undoStack
  })
}