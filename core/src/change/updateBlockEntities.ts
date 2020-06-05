import EditorState from '../state'
import getBlocksForRange from '../query/getBlocksForRange'
import { COMMAND } from '../constants'

export default function updateBlockEntiies (
  editorState: EditorState,
  start: number,
  end: number,
  entity: string | null
): EditorState {
  return getBlocksForRange(
    editorState.value,
    start,
    end
  ).reduce((newEditorState, { block, blockOffset }) => {
    return newEditorState.change({
      type: COMMAND.UPDATE_BLOCK_ENTITIES,
      start: blockOffset,
      end: blockOffset + 1,
      value: [{
        ...block,
        entity
      }]
    })
  }, editorState)
  .change({
    type: COMMAND.UPDATE_BLOCK_ENTITIES,
    start,
    end,
    value: []
  })
}