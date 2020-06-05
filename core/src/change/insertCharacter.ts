import EditorState from '../EditorState'
import { COMMAND } from '../constants'

export default function insertCharacter(
  editorState: EditorState,
  start: number,
  end: number,
  char: string
) {

  const prevValue = editorState.value[start]
  const nextValue = editorState.value[end + 1]

  const value = [{
    char,
    styles: editorState.currentStyles
  }]

  if (char === '\n') {
    value.push({
      char: ' ',
      styles: [],
    })
  }

  let newEditorState = editorState.change({
    isBoundary: editorState.lastChangeType !== COMMAND.INSERT_CHARACTER,
    type: COMMAND.INSERT_CHARACTER,
    start,
    end,
    value
  }).change({
    type: COMMAND.INSERT_CHARACTER,
    start: start + 1,
    end: start + 1
  })

  return newEditorState
}