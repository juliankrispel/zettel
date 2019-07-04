import findAfter from './findAfter'
import findBefore from './findBefore'
import getIndexAfter from './getIndexAfter'
import getIndexBefore from './getIndexBefore'
import EditorState from './EditorState'
import change from './EditorState/change'
import onKeyDown from './handlers/onKeyDown'
import onPaste from './handlers/onPaste'
import createTextFragments from './createTextFragments'
import rawToFlat from './rawToFlat'
import getBlocksForRange from './getBlocksForRange'
import textToFlat from './textToFlat'
import textToListIndex from './textToListIndex'
import getDomSelection from './selection/getDomSelection'
import setDomSelection from './selection/setDomSelection'
import valueFromText from './valueFromText'
import getBlockNumber from './getBlockNumber'
import getBlockOffset from './getBlockOffset'
import onInput from './handlers/onInput'
import onSelectionChange from './handlers/onSelectionChange'
import flatToTree from './flatToTree'
/* what */
export * from './types'
import { Entity } from './types'

export {
  Entity,
  findAfter,
  onSelectionChange,
  getBlocksForRange,
  findBefore,
  change,
  getDomSelection,
  setDomSelection,
  getIndexAfter,
  getIndexBefore,
  getBlockNumber,
  EditorState,
  onInput,
  onKeyDown,
  onPaste,
  createTextFragments,
  rawToFlat,
  textToFlat,
  textToListIndex,
  valueFromText,
  getBlockOffset,
  flatToTree,
}