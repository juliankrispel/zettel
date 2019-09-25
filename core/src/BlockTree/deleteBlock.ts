import dissocPath from 'ramda/src/dissocPath'
import { BlockTree } from '../types'

export default function deleteBlock(
  tree: BlockTree,
  key: string
): BlockTree {
  let path = tree.blockMap[key]

  return dissocPath(['blockMap', key], dissocPath(path, tree))
}
