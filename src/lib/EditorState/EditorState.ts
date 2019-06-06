import { BlockTree, ListState, RawDocument } from '../types'
import rawToFlat from './rawToFlat'
import flatToTree from './flatToTree'

const emptyList: ListState = {
  value: [],
  entityMap: {}
}

const emptyTree: BlockTree = {
  blocks: [],
  entityMap: {}
}

export default class EditorState {
  tree: BlockTree = emptyTree
  list: ListState  = emptyList

  /**
   * creates a new EditorState from JSON format
   * 
   * @param json 
   */
  fromJSON(json: RawDocument) {
    this.list = rawToFlat(json)
    this.tree = flatToTree(this.list)
  }
}