import {
  BlockTree,
  ListState,
  RawDocument, 
  Change
} from '../types'
import rawToFlat from '../rawToFlat'
import change from './change'
import flatToTree from '../flatToTree'
import { thisTypeAnnotation } from '@babel/types';

const emptyList: ListState = {
  value: [],
  entityMap: {}
}

type ConstructorProps = {
  list: ListState,
  redoStack?: Change[],
  undoStack?: Change[],
  start?: number,
  end?: number,
}

export default class EditorState {
  list: ListState
  tree: BlockTree
  start: number
  end: number
  redoStack: Change[] = []
  undoStack: Change[] = []

  constructor({
    start = 1,
    end = 1,
    list = emptyList,
    undoStack = [],
    redoStack = []
  }: ConstructorProps) {
    this.list = list
    this.undoStack = undoStack
    this.start = start
    this.end = end
    this.redoStack = redoStack
    this.tree = flatToTree(this.list)
  }

  change(_change: Change) {
    const update = { current: this.list, change: _change }
    const updated = change(update)

    return new EditorState({
      start: updated.change.start,
      end: updated.change.end,
      list: updated.current,
      redoStack: this.redoStack,
      undoStack: [updated.change].concat(this.undoStack)
    })
  }

  undo() {
    if (this.undoStack.length === 0) {
      return this
    }

    const lastUndo: any = this.undoStack.shift()
    const updated = change({
      current: this.list,
      change: {
        ...lastUndo,
        start: lastUndo.start + 1,
        end: lastUndo.end + 1,
      }
    })

    return new EditorState({
      start: updated.change.start,
      end: updated.change.end,
      list: updated.current,
      redoStack: [updated.change].concat(this.redoStack),
      undoStack: this.undoStack
    })
  }

  redo() {
    if (this.redoStack.length === 0) {
      return this
    }

    const lastRedo: any = this.redoStack.shift()
    const updated = change({
      current: this.list,
      change: {
        ...lastRedo,
        start: lastRedo.start + 1,
        end: lastRedo.end + 1,
      }
    })

    return new EditorState({
      start: updated.change.start,
      end: updated.change.end,
      list: updated.current,
      redoStack: this.redoStack,
      undoStack: [updated.change].concat(this.undoStack)
    })
  }

  /**
   * creates a new EditorState from JSON format
   * 
   * @param fromJSON 
   */
  static fromJSON(json: RawDocument) {
    return new EditorState({
      list: rawToFlat(json)
    })
  }
}