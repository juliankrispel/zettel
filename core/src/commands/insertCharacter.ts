import EditorState from '../EditorState'
import { COMMAND } from '../constants'

export default function insertCharacter(
  editorState: EditorState,
  _start: number,
  _end: number,
  event: KeyboardEvent, 
) {
  // @ts-ignore
  const start = event.isComposing ? _start - 1 : _start
  // @ts-ignore
  const end = event.isComposing ? _end - 1 : _end

  const prevValue = editorState.list.value[start]
  const nextValue = editorState.list.value[end + 1]
  let entity
  let char = event.key
  console.log({ start, end, char })

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
  })

  // @ts-ignore
  if (!event.isComposing) {
    return newEditorState.change({
      type: COMMAND.INSERT_CHARACTER,
      start: start + 1,
      end: start + 1,
      value: [],
    })
  }

  return newEditorState
}