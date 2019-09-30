import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[One Line][And another line of text][And another line]`

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
      editorState={editorState}
    />
  );
}

export default App;
