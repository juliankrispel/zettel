import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[Hello World
[This is evil
[Nesting
[Nestnig]]]]`

const initialEditorState = EditorState.fromJSON({
  text,
  ranges: [{
    offset: 3,
    length: 5,
    styles: ['bold']
  }, {
    offset: 7,
    length: 10,
    styles: ['italic']
  }],
  entityMap: {}
})

const App = () => {
  const [editorState, setEditorState] = useState(initialEditorState)

  return (
    <Editor
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
