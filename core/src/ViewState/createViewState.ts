import { TextCharacter, ListState, BlockTree as ViewState } from '../types'
import createTextFragments from './createTextFragments'
import { getNode, getNodes } from './getTreeNode'

export default function parseBlockTree (
  flat: ListState,
): ViewState {
  const state: ViewState = {
    blocks: [],
    entityMap: flat.entityMap,
  }

  let text: TextCharacter[] = []
  let path: number[] = []

  flat.value.forEach((char, index) => {
    if (
      (char.type === 'block-end' || char.type === 'block-start')
      && text.length > 0
    ) {
      const node = getNode(state, path)
      node.fragments = createTextFragments(text, flat.entityMap)
      node.value = text
      text = []
    }

    if (char.type === 'block-start') {
      const blocks = getNodes(state, path)

      blocks.push({
        fragments: [],
        value: [],
        blocks: [],
        blockKey: char.blockKey,
        styles: char.styles != null ? char.styles : [],
        entity: char.entity != null ? flat.entityMap[char.entity] : null
      })

      path.push(blocks.length - 1)
    } else if (char.type === 'block-end') {
      path.pop()
    } else {
      if (path.length === 0) {
        throw new Error(`Invalid List State`)
      }
      text.push(char)
    }
  })

  return state
}