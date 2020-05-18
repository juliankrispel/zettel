import { Character, ListState, ViewState, TextCharacter, BlockStart, FragmentStart, ContainerFragment } from '../types'
import getBlockByPath from './getBlockByPath'
import getChildrenByPath from './getChildrenByPath'
import getFragmentByPath from './getFragmentByPath'
import getFragmentsByPath from './getFragmentsByPath'
import createTextFragments from './createTextFragments'

type ReducerState = {
  viewState: ViewState,
  i: number,
  currentText: TextCharacter[],
  blockPath: number[],
  fragPath: number[],
}

const reducer = (state: ReducerState, char: Character, i: number) => {
  const blocks = getChildrenByPath(state.viewState, state.blockPath)
  const block = getBlockByPath(state.viewState, state.blockPath)
  const fragment = getFragmentByPath(block, state.fragPath)
  const fragments = getFragmentsByPath(block, state.fragPath)

  switch (char.type) {
    case null:
      state.currentText.push(char as TextCharacter)
      return state

    case 'fragment-start':
    case 'fragment-end':
    case 'block-start':
    case 'block-end':
      let fragmentContainer = fragment as ContainerFragment
      // @ts-ignore
      if (fragment.fragments != null) {
        // @ts-ignore
        fragmentContainer = block
      }
      if (state.currentText.length > 0) {
        fragmentContainer.fragments = createTextFragments(state.currentText, {})
        console.log(fragmentContainer)
        state.currentText = []
        return state
      }
    case 'block-start':
      let _char = char as BlockStart

      blocks.push({
        fragments: [],
        value: [],
        blocks: [],
        blockLevel: state.blockPath.length,
        blockKey: _char.blockKey,
        styles: _char.styles != null ? _char.styles : [],
      })

      state.blockPath.push(blocks.length - 1)
      return state
    case 'block-end':
      state.blockPath.pop()
      return state
    case 'fragment-start':
      let frag = char as FragmentStart
      fragments.push({
        fragments: [],
        data: frag.data
      })
    case 'fragment-end':
      state.fragPath.pop()
      return state
  }
  return state
}

const initialState: ReducerState = {
  viewState: {
    blocks: [],
    entityMap: {}
  },
  i: 0,
  blockPath: [],
  fragPath: [],
  currentText: []
}

export default function reduceViewState (
  flat: ListState,
): ViewState {
  /**
   * Given a document contains the following tokens:
   * `TextCharacter | BlockStart | BlockEnd | FragmentStart | FragmentEnd`
   */
  return flat.value.reduce(reducer, initialState).viewState
}