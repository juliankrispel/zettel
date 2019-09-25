import dissocPath from 'ramda/es/dissocPath'
import over from 'ramda/es/over'
import insert from 'ramda/es/insert'
import lensPath from 'ramda/es/lensPath'
import last from 'ramda/es/last'
import dropLast from 'ramda/es/dropLast'
import flatten from 'ramda/es/flatten'
import getPath from 'ramda/es/path'


import { EntityMap, ListState, BlockTree, Value, Block, BlockStart, BlockEnd, TextCharacter } from './types'
import getBlocksForRange from './getBlocksForRange'
import findBefore from './findBefore'
import getIndexAfter from './getIndexAfter'
import flatToTree from './flatToTree'
import getBlockText from './getBlockText'
import getIndexBefore from './getIndexBefore'
import createTextFragments from './createTextFragments'
import getBlockForIndex from './getBlockForIndex'
import textToFlat from './textToFlat';

function filterBlockStart (value: Value): BlockStart[] {
  return value.filter(val => val.type === 'block-start') as BlockStart[]
}

export function getUpdateFragment(
  list: ListState,
  _start: number,
  _end: number,
): BlockTree {
  const blocks: Block[] = []
  let start = getIndexBefore(
    list.value,
    _start,
    ch => ch.type === 'block-start'
  )

  let end = getIndexAfter(
    list.value,
    _end,
    ch => ch.type === 'block-end'
  )

  if (typeof start !== 'number') {
    start = _start
  }

  if (typeof end !== 'number') {
    end = _end
  }

  return flatToTree({
    value: list.value.slice(start, end + 1),
    entityMap: list.entityMap
  })
}

export function deleteBlock(
  tree: BlockTree,
  key: string
): BlockTree {
  let path = flatten(tree.blockMap[key].map(item => ['blocks', item]))

  return dissocPath(['blockMap', key], dissocPath(path, tree))
}

function insertBlock (
  path: (string | number)[],
  block: Block,
  tree: BlockTree
): BlockTree {
  const index = last(path) as number
  return over(lensPath(dropLast(1, path)), insert(index, block), tree)
}

function applyFragment(
  tree: BlockTree,
  startPath: number[],
  fragment: BlockTree
): BlockTree {
  const insertPath = flatten(startPath.map(item => ['blocks', item]))
  return Object.keys(fragment.blockMap).reduce(
    (_tree, key) => {
      const path = flatten(fragment.blockMap[key].map(item => ['blocks', item]))
      const block = getPath(path, fragment) as Block
      _tree.blockMap[key] = fragment.blockMap[key]
      const inserted = insertBlock(insertPath.concat(path), block, tree)
      return inserted
    },
    tree
  )
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
  const fragment = getUpdateFragment(list, start, end)

  const firstKey = Object.keys(fragment.blockMap)[0]
  let insertPath = fragment.blockMap[firstKey].slice()
  insertPath.pop()

  // 1. Delete blocks which
  const deleteBlocks = deletedBlocks
    .concat(updatedBlocks)
    .concat([firstKey])

  tree = deleteBlocks.reduce((_tree, key) => deleteBlock(_tree, key), tree)

  console.log({ fragment })
  const applied = applyFragment(
    tree,
    insertPath,
    fragment
  )

  return applied
}