import { Value, SelectionRange } from '../types'
import getFragmentOffset from './getFragmentOffset'
import { getUTF16Length } from '../utils'
import getFragmentNode from './getFragmentNode'

export default function getDomRange(value: Value): SelectionRange | null {
  const domSelection = window.getSelection()

  if (domSelection == null || domSelection.anchorNode == null) {
    return null
  }

  const range = domSelection.getRangeAt(0)
  const endContainer: any = range.endContainer
  const startContainer: any = range.startContainer
  const fragmentOffsetEnd = getFragmentOffset(value, endContainer) || 0
  const fragmentOffsetStart = getFragmentOffset(value, startContainer) || 0
  const anchorNode = getFragmentNode(startContainer)
  const focusNode = getFragmentNode(endContainer)

  let { startOffset, endOffset } = range

  if (anchorNode != null && focusNode != null && anchorNode.dataset.fragment === 'true' && focusNode.dataset.fragment === 'true') {
    startOffset = 1
    endOffset = 1
  } else if (anchorNode != null && focusNode != null) {
    startOffset = getUTF16Length(anchorNode.innerText.slice(0, startOffset))
    endOffset = getUTF16Length(focusNode.innerText.slice(0, endOffset))
  }

  const direction = anchorNode != null && getComputedStyle(anchorNode).direction === 'rtl' ? 'rtl' : 'ltr'

  const start = startOffset + fragmentOffsetStart
  const end = endOffset + fragmentOffsetEnd

  return {
    start,
    end,
    collapsed: range.collapsed,
    direction
  } 
}