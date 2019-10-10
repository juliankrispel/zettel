import EditorState from '../EditorState'
import { COMMAND } from '../constants'

export default function insertCharacter(
  editorState: EditorState,
  start: number,
  end: number,
  char: string
) {

  const prevValue = editorState.list.value[start]
  const nextValue = editorState.list.value[end + 1]
  let entity

  // TODO: Write some tests for this
  // Basically only when we're inside an entity
  // as in next and prev value are contained within the same entity
  // shall we include this inserted value in this entity
  if (
    nextValue != null && nextValue.type == null
    && prevValue != null && prevValue.type == null
    && prevValue.entity === nextValue.entity
  ) {
    entity = prevValue.entity
  }

  let newEditorState = editorState.change({
    isBoundary: editorState.lastChangeType !== COMMAND.INSERT_CHARACTER,
    type: COMMAND.INSERT_CHARACTER,
    start,
    end,
    value: [{
      char: char,
      styles: editorState.currentStyles,
      entity,
    }]
  }).change({
    start: start + 1,
    end: start + 1
  })

  return newEditorState
}