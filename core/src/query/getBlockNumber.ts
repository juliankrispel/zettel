import { Value, BlockStart } from "../types";

type BlockAndIndex = {
  block: BlockStart | null,
  blockOffset: number
}

export default function getBlockNumber(value: Value, blockKey: string): number | void {
  let block: BlockStart | null = null

  for (let i = 0; i <= value.length; i++) {
    const val = value[i]

    if (val.type === 'block-start' && val.blockKey === blockKey) {
      return i
    }
    i++
  }
}