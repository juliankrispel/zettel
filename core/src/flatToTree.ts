import { ListState, BlockTree, Block } from './types'

const getNode = (state: BlockTree, path: number[]): Block  => {
  return path.reduce((acc: any, val) => {
    return acc.blocks[val]
  }, state)
}

const getNodes = (state: BlockTree, path: number[]): Block[]  => {
  if (path.length === 0) {
    return state.blocks
  } else {
    return path.reduce((acc, val) => {
      return acc[val].blocks || acc
    }, state.blocks)
  }
}

const parseBlockTree = (flat: ListState): BlockTree => {
  const state: BlockTree = {
    blocks: [],
    entityMap: {},
  }

  let path: number[] = []

  flat.value.forEach((char, index) => {
    // if we have a start block character,
    // create a new block and add it
    if (char.type === 'block-start') {
      const blocks = getNodes(state, path)

      blocks.push({
        value: [],
        blocks: [],
        blockKey: char.blockKey
      })

      path.push(blocks.length - 1)
    } else if (char.type === 'block-end') {
      path.pop()
    } else {
      if (path.length === 0) {
        throw new Error(`Invalid List State`)
      }
      const node = getNode(state, path)
      node.value.push(char)
    }
  })

  return state
}

export default parseBlockTree