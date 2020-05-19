import { Value, BlockStart } from "../types";

type BlockAndIndex = {
  block: BlockStart | null,
  blockOffset: number
}

export default function getBlockForIndex(value: Value, index: number): BlockAndIndex {
  let block: BlockStart | null = null
  let blockOffset: number = 0

  const curVal = value[index]

  if (curVal != null && 'type' in curVal && curVal.type === 'block-start') {
    return {
      blockOffset: index,
      block: curVal
    }
  }

  for (let i = 0; i <= index; i++) {
    const val = value[i]
    if (val != null && 'type' in val && val.type === 'block-start') {
      block = val
      blockOffset = i
    }
  }

  return {
    blockOffset,
    block
  }
}