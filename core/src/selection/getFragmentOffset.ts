import { Value } from '../types'
import getBlockOffset from '../query/getBlockOffset'
import getFragmentNode from './getFragmentNode'

export default function getFragmentOffset (value: Value, node: HTMLElement) {
  const fragment = getFragmentNode(node)
  if (fragment == null) return null
  if (fragment.dataset == null) return null

  const {
    fragmentStart,
    blockKey
  } = fragment.dataset
  const blockOffset = getBlockOffset(value, blockKey)

  if (blockOffset == null) return null
  return blockOffset + parseInt(fragmentStart)
}
