import { Value, SelectionState } from "../types";
import getBlockOffset from '../query/getBlockOffset'
import { getUTF16Length } from '../utils'
import getFragmentNode from './getFragmentNode'

export default (value: Value): SelectionState | null => {
  const domSelection = window.getSelection()

  if (domSelection == null || domSelection.anchorNode == null) {
    return null
  }

  let {
    anchorOffset,
    focusOffset,
  } = domSelection


  const _anchorNode = domSelection.anchorNode as HTMLElement
  const _focusNode = domSelection.focusNode as HTMLElement

  const anchorNode = getFragmentNode(_anchorNode)
  const focusNode = getFragmentNode(_focusNode)

  if (anchorNode != null && focusNode != null) {
    anchorOffset = getUTF16Length(anchorNode.innerText.slice(0, anchorOffset))
    focusOffset = getUTF16Length(focusNode.innerText.slice(0, focusOffset))
  }

  if (anchorNode == null || focusNode == null) {
    console.log('no anchor node')
    return null
  }

  const anchorKey = anchorNode.dataset.blockKey
  const focusKey = focusNode.dataset.blockKey

  const anchorFragmentOffset = parseInt(anchorNode.dataset.start)
  const focusFragmentOffset = parseInt(focusNode.dataset.start)

  anchorOffset+= (getBlockOffset(value, anchorKey) || 0) + anchorFragmentOffset
  focusOffset+= (getBlockOffset(value, focusKey) || 0) + focusFragmentOffset

  const [start, end] = [anchorOffset, focusOffset].sort((a, b) => a - b)

  return {
    start,
    end,
    anchorOffset,
    focusOffset
  }
}