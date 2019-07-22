import getBlockForIndex from '../getBlockForIndex'
import getDomSelection from './getDomSelection'
import EditorState from '../EditorState'

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
    throw new Error('cannot select current start and end position')
  }

  const anchorNodes = containerNode.querySelectorAll(`[data-block-key="${anchorBlock.blockKey}"]`)
  const focusNodes = containerNode.querySelectorAll(`[data-block-key="${focusBlock.blockKey}"]`)
  const anchorOffset = editorState.anchorOffset - anchorBlockOffset
  const focusOffset = editorState.focusOffset - focusBlockOffset

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

  const anchorNode = findRangeTarget(anchorFragment)
  const focusNode = findRangeTarget(focusFragment)

  const newSelection = window.getSelection()

  if (newSelection != null && anchorNode != null && focusNode != null) {
    newSelection.setBaseAndExtent(
      anchorNode,
      anchorOffset - anchorFragmentOffset,
      focusNode,
      focusOffset - focusFragmentOffset
    )
  }
}
