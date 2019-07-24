import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'
import { Button } from '../components'

const text = `[One Line][And another line of text][And another line]`

const initialEditorState = EditorState.fromJSON({
  text,
  ranges: [],
  entityMap: {}
})

const App = () => {
  const [editorState, setEditorState] = useState(initialEditorState)

  return (
    <div>
      <Editor
        htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
    </div>
  );
}

export default App;
