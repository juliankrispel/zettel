import * as React from 'react';
import { useState } from 'react'
import { EditorState, valueFromText, Value } from '@zettel/core'
import Editor from '@zettel/react'

const value: Value = [
  ...valueFromText('[One '),
  { type: 'fragment-start', data: { mention: 'something' } },
  ...valueFromText('Two'),
  { type: 'fragment-end' },
  ...valueFromText(' Three]'),
]

const App = () => {
  const [editorState, setEditorState] = useState(() => new EditorState({ value }))

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
