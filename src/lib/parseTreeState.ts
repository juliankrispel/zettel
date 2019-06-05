import { FlatState, TreeState, Block } from './types'
import id from './id'

const getNode = (state: TreeState, path: number[]): Block  => {
  return path.reduce((acc: any, val) => {
    return acc.nodes[val]
  }, state)
}


const getNodes = (state: TreeState, path: number[]): Block[]  => {
  if (path.length === 0) {
    return state.nodes
  } else {
    return path.reduce((acc, val) => {
      return acc[val].nodes || acc
    }, state.nodes)
  }
}

const parseTreeState = (flat: FlatState): TreeState => {
  const state: TreeState = {
    nodes: [],
    meta: {},
  }

  let path: number[] = []

  flat.value.forEach((char, index) => {
    // if we have a start block character,
    // create a new block and add it
    if (char.char === '[') {
      const nodes = getNodes(state, path)

      nodes.push({
        value: [],
        nodes: [],
        key: id(),
      })

      path.push(nodes.length - 1)
    } else if (char.char === ']') {
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

export default parseTreeState