import * as React from 'react';
import { useState } from 'react'
import { EditorState, valueFromText, ListState } from '@zettel/core'
import Editor from '@zettel/react'

const list: ListState = {
  value: [
    ...valueFromText('[One '),
    { type: 'fragment-start', data: { mention: 'something' } },
    ...valueFromText('Two'),
    { type: 'fragment-end' },
    ...valueFromText(' Three]'),
  ]
}

const App = () => {
  const [editorState, setEditorState] = useState(() => new EditorState({ list }))

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
