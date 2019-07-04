import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'
import { Button } from '../components'

const text = `[Headline 1][Headline 2][A paragraph]`

const initialEditorState = EditorState.fromJSON({
  text,
  ranges: [{
    offset: 0,
    length: 1,
    styles: [],
    entity: '1'
  }, {
    offset: 12,
    length: 1,
    styles: [],
    entity: '2'
  }],
  entityMap: {
    '1': {
      type: 'H1'
    },
    '2': {
      type: 'H2'
    }
  }
})

const setBlock = (editorState: EditorState): EditorState => {
  let newEditorSate = editorState
  // newEditorState.change
  return newEditorSate
}

const App = () => {
  const [editorState, setEditorState] = useState(initialEditorState)

  return (
    <div>
      <Button>H1</Button>
      <Editor
        renderBlock={(props) => {
          const { htmlAttrs, children, block } = props
          if (block.entity != null) {
            if (block.entity.type === 'H1') {
              return <h1 {...htmlAttrs}>{children}</h1>
            } else if (block.entity.type === 'H2') {
              return <h2 {...htmlAttrs}>{children}</h2>
            }
          }
          return <div {...htmlAttrs}>{children}</div>
        }}
        htmlAttrs={{ className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
    </div>
  );
}

export default App;
