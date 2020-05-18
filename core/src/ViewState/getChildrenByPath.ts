import { ViewState, Block } from '../types'

export default function getNodes (state: ViewState, path: number[]): Block[] {
  if (path.length === 0) {
    return state.blocks
  }

  return path.reduce((acc, val) => {
    return acc[val].blocks || acc
  }, state.blocks)
}
