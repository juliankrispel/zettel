import * as React from 'react';
import { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor, { EditorChildren } from '@zettel/react'
import './index.css'

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
        const { htmlAttrs, children } = props
        return <div {...htmlAttrs} className="tree-node">
          {children}
          <EditorChildren {...props} blocks={props.block.blocks} />
        </div>
      }}
      editorState={editorState}
    />
  );
}

export default App;
