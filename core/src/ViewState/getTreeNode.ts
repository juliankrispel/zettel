import { BlockTree, Block } from '../types'

export function getNodes (state: BlockTree, path: number[]): Block[] {
  if (path.length === 0) {
    return state.blocks
  }

  return path.reduce((acc, val) => {
    return acc[val].blocks || acc
  }, state.blocks)
}

export function getNode (state: BlockTree, path: number[]): Block {
  return path.reduce((acc: any, val) => {
    return acc.blocks[val]
  }, state)
}
