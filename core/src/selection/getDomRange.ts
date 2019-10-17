import { ListState, SelectionRange } from '../types'
import getFragmentOffset from './getFragmentOffset'
import { getUTF16Length } from '../utils'
import getFragmentNode from './getFragmentNode'

export default function getDomRange(list: ListState): SelectionRange | null {
  const domSelection = window.getSelection()

  if (domSelection == null || domSelection.anchorNode == null) {
    return null
  }

  const range = domSelection.getRangeAt(0)
  const endContainer: any = range.endContainer
  const startContainer: any = range.startContainer
  const fragmentOffsetEnd = getFragmentOffset(list, endContainer) || 0
  const fragmentOffsetStart = getFragmentOffset(list, startContainer) || 0
  const anchorFragmentNode = getFragmentNode(startContainer)
  const focusFragmentNode = getFragmentNode(endContainer)

  let { startOffset, endOffset } = range


  if (anchorFragmentNode != null && focusFragmentNode != null) {
    startOffset = getUTF16Length(anchorFragmentNode.innerText.slice(0, startOffset))
    endOffset = getUTF16Length(focusFragmentNode.innerText.slice(0, endOffset))
  }

  const direction = anchorFragmentNode != null && getComputedStyle(anchorFragmentNode).direction === 'rtl' ? 'rtl' : 'ltr'

  const start = startOffset + fragmentOffsetStart
  const end = endOffset + fragmentOffsetEnd

  return {
    start,
    end,
    collapsed: range.collapsed,
    direction
  } 
}