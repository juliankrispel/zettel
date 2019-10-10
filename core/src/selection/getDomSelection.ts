import { ListState, SelectionState } from "../types";
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

export default (listState: ListState): SelectionState | null => {
  const domSelection = window.getSelection()

  if (domSelection == null || domSelection.anchorNode == null) {
    return null
  }

  const range = domSelection.getRangeAt(0)
  const {} = range

  let {
    anchorOffset,
    focusOffset
  } = domSelection

  console.log({ range, anchorOffset, focusOffset })

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

  anchorOffset+= (getBlockOffset(listState, anchorKey) || 0) + anchorFragmentOffset
  focusOffset+= (getBlockOffset(listState, focusKey) || 0) + focusFragmentOffset

  const [start, end] = [anchorOffset, focusOffset].sort((a, b) => a - b)

  return {
    start,
    end,
    anchorOffset,
    focusOffset,
  }
}