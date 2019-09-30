import React, { useState } from 'react'
import { EditorState, getBlockNumber } from '@editable/core'
import Editor from '@editable/react'

const text = `[Here's a line of text]`

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
        renderBlock={(props) => {
          const { htmlAttrs, children, block } = props
          const text = block.fragments.map(frag => frag.text).join('')

          // if (text.startsWith('# ')) {
          //   return <h1 {...htmlAttrs}>{children}</h1>
          // }

          // if (text.startsWith('## ')) {
          //   return <h2 {...htmlAttrs}>{children}</h2>
          // }

          // if (text.startsWith('### ')) {
          //   return <h3 {...htmlAttrs}>{children}</h3>
          // }

          // if (text === '---') {
          //   return <hr />
          // }

          return <div {...htmlAttrs}>{children}</div>
        }}
        editorState={editorState}
      />
    </div>
  );
}

export default App;
