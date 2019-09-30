import React, { useState } from 'react'
import { EditorState, getBlockNumber } from '@zettel/core'
import Editor from '@zettel/react'
import './index.css'
import { Button } from '../../components'

const text = `[One Line[Another line[And another line]]][And another line of text][And another line]`

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      onChange={setEditorState}
      renderBlock={(props) => {
        const { htmlAttrs, children, block } = props
        const text = block.fragments.map(frag => frag.text).join('')
        return <div {...htmlAttrs} className="tree-node">{children}</div>
      }}
      editorState={editorState}
    />
  );
}

export default App;
