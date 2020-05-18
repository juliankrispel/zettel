import { ViewState, Block } from '../types'

export default function getBlockByPath (state: ViewState, path: number[]): Block {
  return path.reduce((acc: any, val) => {
    return acc.blocks[val]
  }, state)
}
