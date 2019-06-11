import { ListState } from "../types";
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

export default (listState: ListState) => {
  const domSelection = window.getSelection()

  if (domSelection == null || domSelection.anchorNode == null) {
    return null
  }

  let {
    anchorOffset,
    focusOffset
  } = domSelection

  const _anchorNode: any = domSelection.anchorNode
  const _focusNode: any = domSelection.focusNode
  const anchorNode = getFragmentNode(_anchorNode)
  const focusNode = getFragmentNode(_focusNode)

  if (anchorNode == null || focusNode == null) {
    return null
  }

  const anchorKey = anchorNode.dataset.blockKey
  const focusKey = focusNode.dataset.blockKey

  const anchorFragmentOffset = parseInt(anchorNode.dataset.fragmentStart)
  const focusFragmentOffset = parseInt(focusNode.dataset.fragmentStart)

  anchorOffset+= (getBlockOffset(listState, anchorKey) || 0) + anchorFragmentOffset + 1 
  focusOffset+= (getBlockOffset(listState, focusKey) || 0) + focusFragmentOffset + 1

  return [anchorOffset, focusOffset].sort((a, b) => a - b)
}