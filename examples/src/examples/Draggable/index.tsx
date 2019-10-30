import React, { useState } from 'react'
import Draggable from 'react-draggable';
import { EditorState } from '@zettel/core'
import Editor, { RenderBlock } from '@zettel/react'
import './index.css'

const text = `[One Line][Another line][And another line]`

const emptyPositions: { [key: string]: {x: number, y: number} } = {}

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  const [positions, setPosition] = useState(emptyPositions);

  const updatePosition = (key: string, x: number, y: number) => {
    setPosition({
      ...positions,
      [key]: { x, y }
    })
  }

  const getPosition = (key: string) => {
    return positions[key]
  }

  const renderBlock: RenderBlock = (props) => {
    const { htmlAttrs, children, block } = props

    return <Draggable
      handle=".handle"
      position={getPosition(block.blockKey)}
      onStop={(event, { x, y }) => {
        updatePosition(block.blockKey, x, y)
      }}
      scale={1}
    >
      <div>
        <div contentEditable={false} className="handle"></div>
        <div {...htmlAttrs}>{children}</div>
      </div>
    </Draggable>
  }

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      onChange={setEditorState}
      renderBlock={renderBlock}
      editorState={editorState}
    />
  );
}

export default App;
