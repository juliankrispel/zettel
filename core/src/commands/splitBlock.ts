import getBlockForIndex from '../getBlockForIndex'
import EditorState from '../EditorState'
import id from '../EditorState/id'

export default function splitBlock(
  editorState: EditorState,
  start: number, 
  end: number
) {
  const { block: currentBlock } = getBlockForIndex(editorState.list.value, start)
  return editorState.change({
    start,
    end,
    value: [
      { type: 'block-end' },
      { ...currentBlock, type: 'block-start', blockKey: id()}
    ]
  }).change({
    start: end + 2,
    end: end + 2,
    value: []
  })
}