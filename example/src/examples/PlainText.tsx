import React, { useState } from 'react'
import { EditorState } from '@editable/core'
import Editor from '@editable/react'
import { Button } from '../components'

const text = `[One Line][And another line of text][And another line]`

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

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
