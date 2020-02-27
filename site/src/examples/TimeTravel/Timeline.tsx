import * as React from 'react'
import { EditorState, undo, redo } from '@zettel/core'
import './index.css'

type Props = {
  editorState: EditorState,
  onChange: (editorState: EditorState) => void
}

type Method = (editorState: EditorState) => EditorState

const recurse = (num: number, editorState: EditorState, method: Method): EditorState => {
  if (num === 0) {
    return editorState
  }
  return recurse(num - 1, method(editorState), method)
}

export default function Timeline({ editorState, onChange }: Props) {
  const { undoStack, redoStack } = editorState
  return <div className="timeline">
    {(undoStack.length + redoStack.length) === 0 && <span style={{color: '#fff'}}>Start typing something and you'll see your undo states appear here</span>}
    {undoStack.map((_, index) => (
      <button
        onClick={() => onChange(recurse(undoStack.length - index, editorState, undo))}
        className="undo-step"
      ></button>
    ))}
    {redoStack.map((item, index) => (
      <button
        onClick={() => onChange(recurse(index + 1, editorState, redo))}
        className="redo-step"
      ></button>
    ))}
  </div>
}

