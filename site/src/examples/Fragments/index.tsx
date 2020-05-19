import * as React from 'react';
import { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'
import styled from 'styled-components'
const Container = styled.div`
  display: flex;
  padding: 0;
  height: 100%;
  border-top: 1px solid #ccc;
  .editor {
    padding: 0;
  }
`

const text = `[One 😅Line][And another line of text][And another line]`

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  return (
    <Container>
      <Editor
        htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
    </Container>
  );
}

export default App;
