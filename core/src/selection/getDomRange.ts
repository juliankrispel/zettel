import { ListState } from '../types'
import getFragmentOffset from './getFragmentOffset'

export default function getDomRange(list: ListState): { start: number, end: number } | null {
  const domSelection = window.getSelection()
  if (domSelection == null || domSelection.anchorNode == null) {
    return null
  }

  const range = domSelection.getRangeAt(0)
  const endContainer: any = range.endContainer
  const startContainer: any = range.startContainer
  const fragmentOffsetEnd = getFragmentOffset(list, endContainer) || 0
  const fragmentOffsetStart = getFragmentOffset(list, startContainer) || 0

  return {
    start: range.startOffset + fragmentOffsetStart,
    end: range.endOffset + fragmentOffsetEnd
  } 
}