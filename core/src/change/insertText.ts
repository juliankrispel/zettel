import EditorState from '../state'
import fromText from '../serialize/valueFromText'
import { COMMAND } from '../constants'

export default function paste(
  editorState: EditorState,
  start: number,
  end: number,
  text: string
) {
  const value = fromText(text)
  return editorState.change({
    start,
    end,
    value: value,
  }).change({
    start: start + value.length,
    end: start + value.length,
    value: []
  })

}