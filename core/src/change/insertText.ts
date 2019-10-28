import EditorState from '../EditorState'
import fromText from '../serialize/valueFromText'
import { COMMAND } from '../constants'

export default function insertText(
  editorState: EditorState,
  start: number,
  end: number,
  text: string
) {
  const value = fromText(text)
  return editorState.change({
    isBoundary: editorState.lastChangeType !== COMMAND.INSERT_CHARACTER,
    type: COMMAND.INSERT_TEXT,
    start,
    end,
    value: value,
  }).change({
    type: COMMAND.INSERT_TEXT,
    start: start + value.length,
    end: start + value.length,
    value: []
  })

}