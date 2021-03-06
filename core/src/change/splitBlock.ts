import getBlockForIndex from '../query/getBlockForIndex'
import EditorState from '../EditorState'
import id from '../EditorState/id'
import { COMMAND } from '../constants'
import { BlockEnd } from '../types'
import { BlockStart } from '../types'

export default function splitBlock(
  editorState: EditorState,
  start: number, 
  end: number
) {
  const { block: currentBlock } = getBlockForIndex(editorState.value, start)
  const blockEnd: BlockEnd = { type: 'block-end' }
  const blockStart: BlockStart = { styles: [], ...currentBlock, type: 'block-start', blockKey: id() }

  const newEditorState = editorState.change({
    isBoundary: true,
    type: COMMAND.SPLIT_BLOCK,
    start,
    end,
    value: [
      blockEnd,
      blockStart 
    ]
  }).change({
    type: COMMAND.SPLIT_BLOCK,
    start: start + 2,
    end: start + 2,
    value: [],
  })

  return newEditorState
}