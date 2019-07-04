import { Value, BlockStart } from "./types";
import getBlockForIndex from './getBlockForIndex'

type BlockAndIndex = {
  block: BlockStart | null,
  blockOffset: number
}

/**
 * Gets block indeces for range (start, end)
 */
export default function getBlocksForRange(value: Value, start: number, end: number): BlockAndIndex[] {
  const blocks: BlockAndIndex[] = [getBlockForIndex(value, start)]

  return value.slice(start, end).reduce((acc, ch, index) => {
    if (ch.type === 'block-start') {
      return acc.concat({
        blockOffset: start + index,
        block: ch
      })
    }
    return acc
  }, blocks)
}