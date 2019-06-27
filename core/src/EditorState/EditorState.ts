import {
  BlockTree,
  ListState,
  RawDocument, 
  Change,
  Changes,
  Value,
  Character,
} from '../types'
import rawToFlat from '../rawToFlat'
import change, { Update } from './change'
import textToFlat from '../textToFlat'
import flatToTree from '../flatToTree'

const emptyList: ListState = {
  value: [],
  entityMap: {}
}

type CharacterUpdate = {
  styles: string[],
  entity?: string | null,
  type?: void,
}

type EditorChange = {
  start?: number,
  end?: number,
  value: Value,
  isBoundary?: boolean
}

type ConstructorProps = {
  list: ListState,
  currentStyles?: string[],
  redoStack?: Changes[],
  undoStack?: Changes[],
  start?: number,
  end?: number,
}

export default class EditorState {
  list: ListState
  tree: BlockTree
  start: number
  end: number
  currentStyles: string[]
  redoStack: Changes[] = []
  undoStack: Changes[] = []

  constructor({
    start = 1,
    end = 1,
    list = emptyList,
    currentStyles = [],
    undoStack = [],
    redoStack = []
  }: ConstructorProps) {
    this.list = list
    this.undoStack = undoStack
    this.currentStyles = currentStyles
    this.start = start
    this.end = end
    this.redoStack = redoStack
    this.tree = flatToTree(this.list)
  }

  change(_change: EditorChange) {
    const defaultChange: Change = {
      start: this.start,
      end: this.end,
      value: []
    }

    const update: Update = {
      current: this.list,
      change: {
        ...defaultChange,
        ..._change,
      }
    }

    const isBoundary = _change.isBoundary === true
    const updated = change(update)
    let undoStack = this.undoStack
    const [lastUndo, ...undoRest] = this.undoStack

    if (Boolean(_change.isBoundary) === false) {
      undoStack = [[updated.change].concat(lastUndo || [])].concat(undoRest)
    } else {
      undoStack = [[updated.change]].concat([lastUndo || []].concat(undoRest))
    }

    return new EditorState({
      start: (updated.change.start || this.start) - 1,
      end: (updated.change.end || this.end) - 1,
      currentStyles: this.currentStyles,
      list: updated.current,
      redoStack: [],
      undoStack
    })
  }

  undo() {
    if (this.undoStack.length === 0) {
      return this
    }

    const [lastChanges, ...rest] = this.undoStack
    const emptyChange: Changes = []
    
    let newEditorState = new EditorState({
      start: this.start,
      end: this.end,
      list: this.list,
      redoStack: [emptyChange].concat([...this.redoStack]),
      undoStack: this.undoStack
    })

    newEditorState = lastChanges.reduce((editorState: EditorState, lastChange: Change) => {
      const updated = change({
        current: editorState.list,
        change: {
          ...lastChange,
          start: lastChange.start,
          end: lastChange.end,
        }
      })

      const [lastRedo, ...redoStack] = editorState.redoStack

      return new EditorState({
        start: updated.change.start,
        end: updated.change.end,
        list: updated.current,
        redoStack: [[updated.change].concat(lastRedo || [])].concat(redoStack),
        undoStack: rest
      })
    }, newEditorState)

    return new EditorState({
      start: newEditorState.start - 1,
      end: newEditorState.end - 1,
      list: newEditorState.list,
      redoStack: newEditorState.redoStack,
      undoStack: newEditorState.undoStack
    })
  }

  redo() {
    if (this.redoStack.length === 0) {
      return this
    }

    const emptyChange: Changes = []

    let newEditorState = new EditorState({
      start: this.start,
      end: this.end,
      list: this.list,
      redoStack: this.redoStack,
      undoStack: [emptyChange].concat([...this.undoStack])
    })

    const [lastChanges, ...rest] = this.redoStack
    newEditorState = lastChanges.reduce((editorState: EditorState, lastChange: Change) => {
      const updated = change({
        current: editorState.list,
        change: {
          ...lastChange,
          start: lastChange.start,
          end: lastChange.end,
        }
      })

      const [lastUndo, ...undoStack] = editorState.undoStack

      return new EditorState({
        start: updated.change.start,
        end: updated.change.end,
        list: updated.current,
        redoStack: rest,
        undoStack: [[updated.change].concat(lastUndo || [])].concat(undoStack),
      })
    }, newEditorState)

    return new EditorState({
      start: newEditorState.start - 1,
      end: newEditorState.end - 1,
      list: newEditorState.list,
      redoStack: newEditorState.redoStack,
      undoStack: newEditorState.undoStack
    })
  }

  setCurrentStyles(styles: string[]) {
    this.currentStyles = styles
    return this
  }

  /**
   * gets selected value, arguments default
   * to editorState.start and editorState.end
   * 
   * @param start start offset
   * @param end end offset
   */
  getSelectedValue(
    start: number = this.start,
    end: number = this.end
  ): Value {
    return this.list.value.slice(start, end)
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
      list: textToFlat(text)
    })
  }
}