import EditorState from '../EditorState'
import change from '../EditorState/change'
import { COMMAND } from '../constants'
import { Changes, Change } from '..';

export default function undo(editorState: EditorState): EditorState | null {
  if (editorState.undoStack.length === 0) {
    return null
  }

  const [lastChanges, ...rest] = editorState.undoStack
  const emptyChange: Changes = []
  
  let newEditorState = new EditorState({
    start: editorState.start,
    end: editorState.end,
    list: editorState.list,
    redoStack: [emptyChange].concat([...editorState.redoStack]),
    undoStack: editorState.undoStack
  })

  newEditorState = lastChanges.reduce((editorState: EditorState, lastChange: Change) => {
    const updated = change({
      current: editorState.list,
      change: {
        ...lastChange,
        start: lastChange.start,
        end: lastChange.end,
      }
    })

    const [lastRedo, ...redoStack] = editorState.redoStack

    return new EditorState({
      start: updated.change.start,
      end: updated.change.end,
      list: updated.current,
      redoStack: [[updated.change].concat(lastRedo || [])].concat(redoStack),
      undoStack: rest
    })
  }, newEditorState)

  return new EditorState({
    start: newEditorState.start - 1,
    lastChangeType: COMMAND.UNDO,
    end: newEditorState.end - 1,
    list: newEditorState.list,
    redoStack: newEditorState.redoStack,
    undoStack: newEditorState.undoStack
  })
}