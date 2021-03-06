import { Block, Fragment, Character, ListState, ViewState, TextCharacter, BlockStart, FragmentStart, ContainerFragment } from '../types'
import getBlockByPath from './getBlockByPath'
import getChildrenByPath from './getChildrenByPath'
import getFragmentByPath from './getFragmentByPath'
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
  const type = 'type' in char ? char.type : null

  if (type == null) {
    state.currentText.push(char as TextCharacter)
    return state
  }

  if (state.currentText.length > 0) {
    if (fragment != null && 'fragments' in fragment) {
      fragment.fragments = fragment.fragments.concat(createTextFragments(state.currentText))
    } else {
      block.fragments = block.fragments.concat(createTextFragments(state.currentText))
    }
      
    block.value = block.value.concat(state.currentText)
    state.currentText = []
  }

  if (type === 'fragment-start') {
    let frag = char as FragmentStart
    if ('fragments' in fragment) {
      state.fragPath.push(fragment.fragments.length)
      fragment.fragments.push({
        fragments: [],
        data: frag.data
      })
    } else {
      state.fragPath.push(block.fragments.length)
      block.fragments.push({
        fragments: [],
        data: frag.data
      })
    }
  } else if (type === 'fragment-end') {
    state.fragPath.pop()
  } else if (type === 'block-start') {
    let _char = char as BlockStart
    const _block: Block = {
      fragments: [],
      value: [],
      blocks: [],
      blockLevel: state.blockPath.length,
      blockKey: _char.blockKey,
      styles: _char.styles != null ? _char.styles : [],
    }

    blocks.push(_block)

    state.blockPath.push(blocks.length - 1)
  } else if (type == 'block-end') {
    state.blockPath.pop()
  }

  return state
}


export default function reduceViewState (
  flat: ListState,
): ViewState {
  /**
   * Given a document contains the following tokens:
   * `TextCharacter | BlockStart | BlockEnd | FragmentStart | FragmentEnd`
   */
  const initialState: ReducerState = {
    viewState: {
      blocks: [],
    },
    i: 0,
    blockPath: [],
    fragPath: [],
    currentText: []
  }

  return flat.value.reduce(reducer, initialState).viewState
}