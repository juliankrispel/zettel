import * as React from 'react';
import { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'
import Timeline from './Timeline'

const text = `[One][Two][Three]`

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  return (
    <>
      <Editor
        htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
      <Timeline editorState={editorState} onChange={setEditorState} />
    </>
  );
}

export default App;
