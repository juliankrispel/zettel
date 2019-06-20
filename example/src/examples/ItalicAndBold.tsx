import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[Italic][And Bold]`

const initialEditorState = EditorState.fromJSON({
  text,
  ranges: [{
    offset: 0,
    length: 5,
    styles: ['bold'],
  }, {
    offset: 3,
    length: 10,
    styles: ['italic'],
  }],
  entityMap: {}
})

const App = () => {
  const [editorState, setEditorState] = useState(initialEditorState)

  console.log(editorState)
  return (
    <Editor
      renderStyle={(props) => {
        if (props.style === 'bold') {
          return <strong>{props.children}</strong>
        } else if (props.style === 'italic') {
          return <i>{props.children}</i>
        } else if (props.style === 'underline') {
          return <u>{props.children}</u>
        }

        return <>{props.children}</>
      }}
      htmlAttrs={{ className: 'editor'}}
      onKeyDown={(event) => {
        if (event.key === 'b' && event.metaKey) {
          return editorState.change({
            value: { styles: ['bold'] }
          })
        } else if (event.key === 'i' && event.metaKey) {
          return editorState.change({
            value: { styles: ['italic'] }
          })
        } else if (event.key === 'u' && event.metaKey) {
          return editorState.change({
            value: { styles: ['underline'] }
          })
        }
      }}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;