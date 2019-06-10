import { BlockTree, ListState, RawDocument, Change } from '../types'
import rawToFlat from './rawToFlat'
import change from './change'
import flatToTree from './flatToTree'

const emptyList: ListState = {
  value: [],
  entityMap: {}
}

type ConstructorProps = {
  list: ListState,
  redoStack?: Change[],
  undoStack?: Change[]
}

export default class EditorState {
  list: ListState
  tree: BlockTree
  redoStack: Change[] = []
  undoStack: Change[] = []

  constructor({ list = emptyList, undoStack = [], redoStack = [] }: ConstructorProps) {
    this.list = list
    this.undoStack = undoStack
    this.redoStack = redoStack
    this.tree = flatToTree(this.list)
  }

  change(_change: Change) {
    const update = { current: this.list, change: _change }
    const updated = change(update)

    return new EditorState({
      list: updated.current,
      redoStack: this.redoStack.concat([_change]),
      undoStack: this.undoStack.concat([updated.change])
    })
  }

  /**
   * creates a new EditorState from JSON format
   * 
   * @param fromJSON 
   */
  static fromJSON(json: RawDocument) {
    return new EditorState({ list: rawToFlat(json) })
  }
}