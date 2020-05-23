import * as React from 'react';
import { useState } from 'react'
import { EditorState } from '@zettel/core'
import styled from 'styled-components'
import Editor from '@zettel/react'

const Container = styled.div`
  padding: 0 1em;
`

const text = `[One 😅Line][And another line of text][And another line]`

const App = () => {
  const [readOnly, setReadonly] = useState(true)
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
  }))

  return (
    <div>
      <Container>
        <p>Uncheck this box to edit.</p>
        <label><input onChange={() => setReadonly(!readOnly)} type="checkbox" name="readonly" checked={readOnly} /> read only</label>
      </Container>
      <Editor
        readOnly={readOnly}
        htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
    </div>
  );
}

export default App;
