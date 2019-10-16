import getBlockForIndex from '../query/getBlockForIndex'
import EditorState from '../EditorState'
import { getUCS2Position } from '../utils'
import getFragmentNode from './getFragmentNode'

const findRangeTarget = (el: Node | null): Node | null => {
  if (el == null) {
    return null
  } else if (['#text', 'BR'].includes(el.nodeName)) {
    return el
  } else if (el.childNodes) {
    const childNodes = Array.from(el.childNodes)

    for (let i = 0; i <= childNodes.length; i++) {
      let child = findRangeTarget(childNodes[i])
      if (child != null) {
        return child
      }
    }
  }

  return null
}

export default function setDomSelection(
  editorState: EditorState,
  containerNode: HTMLElement,
): void {
  const { list } = editorState

  const {
    block: focusBlock,
    blockOffset: focusBlockOffset,
  } = getBlockForIndex(list.value, editorState.focusOffset)

  const {
    block: anchorBlock,
    blockOffset: anchorBlockOffset,
  } = getBlockForIndex(list.value, editorState.anchorOffset)

  if (focusBlock == null || anchorBlock == null) {
    console.warn('cannot select current start and end position')
    return 
  }

  const anchorNodes = containerNode.querySelectorAll(`[data-block-key="${anchorBlock.blockKey}"]`)
  const focusNodes = containerNode.querySelectorAll(`[data-block-key="${focusBlock.blockKey}"]`)
  let anchorOffset = editorState.anchorOffset - anchorBlockOffset
  let focusOffset = editorState.focusOffset - focusBlockOffset

  const anchorFragment: any = Array.from(anchorNodes).find((node: any) => {
    return parseInt(node.dataset.fragmentStart) <= anchorOffset &&
    parseInt(node.dataset.fragmentEnd) >= anchorOffset
  })

  if (anchorFragment == null) {
    return 
  }

  const anchorFragmentOffset = parseInt(anchorFragment.dataset.fragmentStart)

  const focusFragment: any = Array.from(focusNodes).find((node: any) => {
    return parseInt(node.dataset.fragmentStart) <= focusOffset &&
    parseInt(node.dataset.fragmentEnd) >= focusOffset
  })

  const focusFragmentOffset = parseInt(focusFragment.dataset.fragmentStart)

  const anchorNode = findRangeTarget(anchorFragment) as HTMLElement
  const focusNode = findRangeTarget(focusFragment) as HTMLElement

  const newSelection = window.getSelection()

  anchorOffset = anchorOffset - anchorFragmentOffset
  focusOffset = focusOffset - focusFragmentOffset

  const fragmentAnchorNode = getFragmentNode(anchorNode)
  const fragmentFocusNode = getFragmentNode(focusNode)

  if (fragmentAnchorNode != null && anchorOffset !== 0) {
    anchorOffset = getUCS2Position(fragmentAnchorNode.innerText, anchorOffset)
  }

  if (fragmentFocusNode != null && focusOffset !== 0) {
    focusOffset = getUCS2Position(fragmentFocusNode.innerText, focusOffset)
  }

  if (newSelection != null && anchorNode != null && focusNode != null) {
    newSelection.setBaseAndExtent(
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset
    )
  }
}
