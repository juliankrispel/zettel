import {
  BlockTree,
  ListState,
  RawDocument, 
  Change,
  Value,
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
  value: CharacterUpdate | Value
}

type ConstructorProps = {
  list: ListState,
  currentStyles?: string[],
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
  currentStyles: string[]
  redoStack: Change[] = []
  undoStack: Change[] = []

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
    const update: Update = {
      current: this.list,
      change: {
        ..._change,
        start: _change.start || this.start,
        end: _change.end || this.end,
      }
    }

    const updated = change(update)

    return new EditorState({
      start: (updated.change.start || this.start) - 1,
      end: (updated.change.end || this.end) - 1,
      currentStyles: this.currentStyles,
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
        start: lastUndo.start,
        end: lastUndo.end,
      }
    })

    const diffLength = (lastUndo.end - lastUndo.start) - lastUndo.value.length

    return new EditorState({
      start: updated.change.start - diffLength,
      end: updated.change.end - diffLength,
      list: updated.current,
      redoStack: [updated.change].concat(this.redoStack),
      undoStack: this.undoStack
    })
  }

  setCurrentStyles(styles: string[]) {
    this.currentStyles = styles
    return this
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
        start: lastRedo.start,
        end: lastRedo.end,
      }
    })

    return this.change(lastRedo)
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
      value: updatedValue
    })
    newEditorState.start = _start
    newEditorState.end = _end

    if (!hasStyle || !this.currentStyles.includes(style)) {
      console.log('set current styles')
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