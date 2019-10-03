import React, { useState } from 'react'
import { EditorState, getBlockNumber } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[Try adding one or more # at the beginning of this line and a space]`

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
      renderBlock={(props) => {
        const { htmlAttrs, children, block } = props
        const text = block.fragments.map(frag => frag.text).join('')

        return <div {...htmlAttrs}>{children}</div>
      }}
      editorState={editorState}
    />
  );
}

export default App;
