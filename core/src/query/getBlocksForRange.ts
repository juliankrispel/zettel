import { Value, BlockStart } from "../types";
import getBlockForIndex from './getBlockForIndex'

type BlockAndIndex = {
  block: BlockStart | null,
  blockOffset: number
}

/**
 * Gets block indeces for range (start, end)
 */
export default function getBlocksForRange(value: Value, start: number, end: number): BlockAndIndex[] {
  const firstBlock = getBlockForIndex(value, start)
  const blocks: BlockAndIndex[] = [firstBlock]
  const firstBlockKey = firstBlock != null && firstBlock.block != null && firstBlock.block.blockKey

  return value.slice(start, end).reduce((acc, ch, index) => {
    if (
      ch.type === 'block-start' &&
      ch.blockKey !== firstBlockKey
    ) {
      return acc.concat({
        blockOffset: start + index,
        block: ch
      })
    }
    return acc
  }, blocks)
}