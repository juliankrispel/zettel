import createFragment from './createFragment'
import deleteBlock from './deleteBlock'
import applyFragment from './applyFragment'
import { BlockStart, ListState, Value, BlockTree } from '../types'

function filterBlockStart (value: Value): BlockStart[] {
  return value.filter(val => val.type === 'block-start') as BlockStart[]
}

export default function updateBlockTree(
  currentList: ListState,
  list: ListState,
  newValue: Value,
  oldValue: Value,
  _tree: BlockTree,
  start: number,
  end: number
): BlockTree {
  // Add added blocks, Update updated blocks, Delete deleted blocks
  let tree = _tree

  const oldBlocks = filterBlockStart(oldValue).map(val => val.blockKey)
  const newBlocks = filterBlockStart(newValue).map(val => val.blockKey)
  const deletedBlocks = oldBlocks.filter(val => !newBlocks.includes(val))
  const updatedBlocks = oldBlocks.filter(val => newBlocks.includes(val))
  const fragment = createFragment(list, start, end)

  let insertPath = tree.blockMap[fragment.blocks[0].blockKey]

  // 1. Delete blocks which
  tree = deletedBlocks
    .concat(updatedBlocks)
    .concat([fragment.blocks[0].blockKey])
    .reduce((_tree, key) => deleteBlock(_tree, key), tree)

  return applyFragment(
    tree,
    insertPath,
    fragment
  )
}