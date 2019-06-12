import { Value, BlockStart } from "./types";

type BlockAndIndex = {
  block: BlockStart | null,
  blockOffset: number
}

export default function getBlockForIndex(value: Value, index: number): BlockAndIndex {
  let block: BlockStart | null = null
  let blockOffset: number = 0

  for (let i = 0; i <= index; i++) {
    const val = value[i]
    if (val.type === 'block-start') {
      block = val
      blockOffset = i
    }
  }

  return {
    blockOffset,
    block
  }
}