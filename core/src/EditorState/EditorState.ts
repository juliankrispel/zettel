import {
  BlockTree,
  ListState,
  RawDocument, 
  Change,
  Changes,
  Entity,
  Value,
} from '../types'
import rawToFlat from '../rawToFlat'
import id from './id'
import change, { Update } from './change'
import textToFlat from '../textToFlat'
import flatToTree from '../flatToTree'
import { undo, redo } from '../commands';

const emptyList: ListState = {
  value: [],
  entityMap: {}
}

type EditorChange = {
  start?: number,
  end?: number,
  value?: Value,
  isBoundary?: boolean,
  type?: string
}

type ConstructorProps = {
  list: ListState,
  currentStyles?: string[],
  lastChangeType?: string | null,
  redoStack?: Changes[],
  undoStack?: Changes[],
  start?: number,
  end?: number,
  anchorOffset?: number,
  focusOffset?: number,
  tree?: BlockTree
}

export default class EditorState {
  list: ListState
  tree: BlockTree
  start: number
  end: number
  anchorOffset: number
  focusOffset: number
  lastChangeType: string | null
  currentStyles: string[]
  redoStack: Changes[] = []
  undoStack: Changes[] = []

  constructor({
    start = 0,
    end = 0,
    anchorOffset,
    focusOffset,
    list = emptyList,
    lastChangeType = null,
    currentStyles = [],
    undoStack = [],
    redoStack = [],
    tree = flatToTree(list)
  }: ConstructorProps) {
    this.list = list
    this.undoStack = undoStack
    this.currentStyles = currentStyles

    this.anchorOffset = typeof anchorOffset === 'number' ? anchorOffset : start
    this.focusOffset = typeof focusOffset === 'number' ? focusOffset : end

    let [_start, _end]: number[] = [this.anchorOffset, this.focusOffset].sort((a, b) => a - b)

    this.start = _start
    this.end = _end

    this.lastChangeType = lastChangeType
    this.redoStack = redoStack
    this.tree = tree
  }

  change(_change: EditorChange) {
    const start = (typeof _change.start === 'number' ? _change.start : this.start) + 1
    const end = (typeof _change.end === 'number' ? _change.end : this.end) + 1

    const defaultChange: Change = {
      start: this.start,
      end: this.end,
      value: this.list.value.slice(start, end)
    }

    const update: Update = {
      current: this.list,
      change: {
        ...defaultChange,
        ..._change,
      }
    }

    const updated = change(update)
    let undoStack = this.undoStack
    const [lastUndo, ...undoRest] = this.undoStack

    const lastChangeType = _change.type || null

    if (Boolean(_change.isBoundary) === false || this.undoStack.length === 0) {
      undoStack = [[updated.change].concat(lastUndo || [])].concat(undoRest)
    } else {
      undoStack = [[updated.change]].concat([lastUndo || []].concat(undoRest))
    }
    
    return new EditorState({
      start: updated.change.start - 1,
      end: updated.change.end - 1,
      currentStyles: this.currentStyles,
      lastChangeType,
      list: updated.current,
      redoStack: [],
      undoStack,
      tree: flatToTree(updated.current)
    })
  }

  createEntity(entity: Entity): string {
    const entityKey = id()
    this.list.entityMap[entityKey] = entity
    return entityKey
  }

  undo():EditorState {
    return undo(this) || this
  }

  redo():EditorState {
    return redo(this) || this
  }

  setCurrentStyles(styles: string[]) {
    this.currentStyles = styles
    return this
  }

  toggleStyle(
    style: string,
    _start: number = this.start,
    _end: number = this.end,
  ): EditorState {
    const start = _start + 1
    const end = _end + 1
    const selectedValue = this.list.value.slice(start, end)
    const hasStyle = selectedValue.every(char =>
      char.type != null ||
      char.styles.includes(style)
    )

    const updatedValue = selectedValue.map(char => {
      const newChar = { ...char }
      if (newChar.type == null) {
        if (hasStyle) {
          newChar.styles = newChar.styles.filter(st => st !== style)
        } else if (!newChar.styles.includes(style)) {
          newChar.styles = newChar.styles.concat([style])
        }
      }

      return newChar
    })

    let newEditorState = this.change({
      start,
      end,
      isBoundary: true,
      value: updatedValue
    })
    newEditorState.start = _start
    newEditorState.end = _end

    if (!hasStyle || !this.currentStyles.includes(style)) {
      newEditorState.currentStyles = newEditorState.currentStyles.concat([style])
    } else {
      newEditorState.currentStyles = newEditorState.currentStyles.filter(st => st !== style)
    }

    return newEditorState
  }

  /**
   * creates a new EditorState from JSON format
   * 
   * @param fromJSON 
   */
  static fromJSON(json: RawDocument): EditorState {
    return new EditorState({
      list: rawToFlat(json)
    })
  }

  static fromText(text: string): EditorState {
    return new EditorState({
      list: textToFlat(text),
    })
  }
}