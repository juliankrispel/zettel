import React, { useState } from 'react'
import Draggable from 'react-draggable';
import { EditorState, getBlockNumber } from '@editable/core'
import Editor from '@editable/react'
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

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      onChange={setEditorState}
      renderBlock={(props) => {
        const { htmlAttrs, children, block } = props

        return <Draggable
          handle=".handle"
          position={positions[block.blockKey]}
          onStop={(event, { x, y }) => {
            setPosition({
              ...positions,
              [block.blockKey]: { x, y }
            })
          }}
          scale={1}
        >
          <div>
            <div contentEditable={false} className="handle"></div>
            <div {...htmlAttrs}>{children}</div>
          </div>
        </Draggable>
      }}
      editorState={editorState}
    />
  );
}

export default App;
