import { ListState, BlockTree, Block } from '../types'
import id from '../id'

const getNode = (state: BlockTree, path: number[]): Block  => {
  return path.reduce((acc: any, val) => {
    return acc.nodes[val]
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
      const nodes = getNodes(state, path)

      nodes.push({
        value: [],
        blocks: [],
        key: id(),
      })

      path.push(nodes.length - 1)
    } else if (char.type === 'block-end') {
      path.pop()
    } else {
      const node = getNode(state, path) || state
      node.value.push({
        char: char.char,
        styles: []
      })
    }
  })

  return state
}

export default parseBlockTree