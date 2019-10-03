import React, { useState } from 'react'
import { EditorState, getBlockNumber } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[[One][Two]][[Three][Four]]`

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
      onKeyDown={(event) => {
        console.log('hello')
        return editorState
      }}
      renderBlock={(props) => {
        const { htmlAttrs, children, block } = props
        const text = block.fragments.map(frag => frag.text).join('')

        if (text.startsWith('# ')) {
          return <h1 {...htmlAttrs}>{children}</h1>
        }

        if (text.startsWith('## ')) {
          return <h2 {...htmlAttrs}>{children}</h2>
        }

        if (text.startsWith('### ')) {
          return <h3 {...htmlAttrs}>{children}</h3>
        }

        if (text === '---') {
          return <hr />
        }

        return <div {...htmlAttrs}>{children}</div>
      }}
      editorState={editorState}
    />
  );
}

export default App;
