import EditorState from '../EditorState'

export default function deleteForward(
  editorState: EditorState,
  start: number,
  end: number,
  char: string, 
) {
  let newEditorState
  const prevValue = editorState.list.value[start - 1]
  const nextValue = editorState.list.value[end + 1]
  let entity

  // TODO: Write some tests for this
  // Basically only when we're inside an entity
  // as in next and prev value are contained within the same entity
  // shall we include this inserted value in this entity
  if (
    nextValue != null && nextValue.type == null
    && prevValue != null && prevValue.type == null
    && prevValue.entity === nextValue.entity) {
    entity = prevValue.entity
  }

  newEditorState = editorState.change({
    start,
    end,
    value: [{
      char: char,
      styles: editorState.currentStyles,
      entity,
    }]
  }).change({
    start: end + 1,
    end: end + 1,
    value: []
  })

  return editorState.change({
    start,
    end,
    value: []
  }).change({
    start: end + 1,
    end: end + 1,
    value: []
  })
}