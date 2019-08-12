import { ListState, BlockTree, Block } from './types'

import { getNode, getNodes } from './getTreeNode'

function parseBlockTree (flat: ListState): BlockTree {
  const state: BlockTree = {
    blocks: [],
    entityMap: flat.entityMap,
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
        blockKey: char.blockKey,
        styles: char.styles != null ? char.styles : [],
        entity: char.entity != null ? flat.entityMap[char.entity] : null
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