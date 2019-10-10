import { ListState } from '../types'
import getBlockOffset from '../getBlockOffset'

interface ElementWithDataSet extends HTMLElement {
  readonly dataset: {
    fragmentStart: string,
    blockKey: string
  }
}

const getFragmentNode = (el: HTMLElement | null): ElementWithDataSet | null => {
  if (el == null) {
    return null
  }

  if (el.dataset && el.dataset.blockKey != null && el.dataset.fragmentStart != null) {
    const _el: any = el
    return _el
  } else if (el.parentElement) {
    return getFragmentNode(el.parentElement)
  }

  return null
}

export default function getFragmentOffset (list: ListState, node: HTMLElement) {
  const fragment = getFragmentNode(node)
  if (fragment == null) return null

  const {
    fragmentStart,
    blockKey
  } = fragment.dataset
  const blockOffset = getBlockOffset(list, blockKey)

  if (blockOffset == null) return null
  return blockOffset + parseInt(fragmentStart)
}
