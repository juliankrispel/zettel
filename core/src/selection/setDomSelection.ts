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
  const newSelection = window.getSelection()
  const { list } = editorState
  const currentDomSelection = getDomSelection(editorState.list)

  if (currentDomSelection != null
    && currentDomSelection[0] === (editorState.start + 1)
    && currentDomSelection[1] === (editorState.end + 1)
  ) {
    return 
  }
    
  const {
    block: startBlock,
    blockOffset: startBlockOffset,
  } = getBlockForIndex(list.value, editorState.start)

  const {
    block: endBlock,
    blockOffset: endBlockOffset,
  } = getBlockForIndex(list.value, editorState.end)

  if (startBlock == null || endBlock == null) {
    throw new Error('cannot select current start and end position')
  }

  const startNodes = containerNode.querySelectorAll(`[data-block-key="${startBlock.blockKey}"]`)
  const endNodes = containerNode.querySelectorAll(`[data-block-key="${endBlock.blockKey}"]`)
  const startOffset = editorState.start - startBlockOffset
  const endOffset = editorState.end - endBlockOffset

  const startFragment: any = Array.from(startNodes).find((node: any) => {
    return parseInt(node.dataset.fragmentStart) <= startOffset &&
    parseInt(node.dataset.fragmentEnd) >= startOffset
  })

  if (startFragment == null) {
    return 
  }

  const startFragmentOffset = parseInt(startFragment.dataset.fragmentStart)

  const endFragment: any = Array.from(endNodes).find((node: any) => {
    return parseInt(node.dataset.fragmentStart) <= endOffset &&
    parseInt(node.dataset.fragmentEnd) >= endOffset
  })

  const endFragmentOffset = parseInt(endFragment.dataset.fragmentStart)
  const startNode = findRangeTarget(startFragment)
  const endNode = findRangeTarget(endFragment)

  newSelection && newSelection.removeAllRanges()
  const range = document.createRange()

  if (startNode != null && endNode != null) {
    range.setStart(startNode, startOffset - startFragmentOffset)
    range.setEnd(endNode, endOffset - endFragmentOffset)
    newSelection && newSelection.addRange(range)
  }
}
