import {
  RawDocument, 
  Change,
  Value,
  EditorChange,
  Changes,
} from '../types'

import rawToFlat from '../serialize/fromRaw'
import change, { Update } from '../change/change'
import textToFlat from '../serialize/fromText'
import { undo, redo } from '../change';

const emptyValue = []

type ConstructorProps = {
  value: Value,
  currentStyles?: string[],
  lastChangeType?: string | null,
  redoStack?: Changes[],
  undoStack?: Changes[],
  start?: number,
  end?: number,
  anchorOffset?: number,
  focusOffset?: number,
}

export default class EditorState {
  value: Value
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
    value = emptyValue,
    lastChangeType = null,
    currentStyles = [],
    undoStack = [],
    redoStack = [],
  }: ConstructorProps) {
    this.value = value
    this.undoStack = undoStack
    this.currentStyles = currentStyles

    this.anchorOffset = typeof anchorOffset === 'number' ? anchorOffset : start
    this.focusOffset = typeof focusOffset === 'number' ? focusOffset : end

    let [_start, _end]: number[] = [this.anchorOffset, this.focusOffset].sort((a, b) => a - b)

    this.start = _start
    this.end = _end

    this.lastChangeType = lastChangeType
    this.redoStack = redoStack
  }

  change(_change: EditorChange) {
    const start = (typeof _change.start === 'number' ? _change.start : this.start) + 1
    const end = (typeof _change.end === 'number' ? _change.end : this.end) + 1

    const defaultChange: Change = {
      start: this.start,
      end: this.end,
      value: this.value.slice(start, end)
    }

    const update: Update = {
      value: this.value,
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
      value: updated.value,
      redoStack: [],
      undoStack,
    })
  }

  undo(): EditorState {
    return undo(this)
  }

  redo(): EditorState {
    return redo(this)
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
    const start:number = _start + 1
    const end = _end + 1
    const selectedValue = this.value.slice(start, end)
    const hasStyle = selectedValue.every(char =>
      'type' in char ||
      (char.styles || []).includes(style)
    )

    const updatedValue = selectedValue.map(char => {
      const newChar = { ...char }
      if ('char' in newChar) {
        if (hasStyle) {
          newChar.styles = (newChar.styles || []).filter(st => st !== style)
        } else if (!(newChar.styles || []).includes(style)) {
          newChar.styles = (newChar.styles || []).concat([style])
        }
      }

      return newChar
    })

    let newEditorState = this.change({
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
      value: rawToFlat(json)
    })
  }

  static fromText(text: string): EditorState {
    return new EditorState({
      value: textToFlat(text),
    })
  }
}