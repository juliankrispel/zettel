import * as React from 'react';
import { useState } from 'react'
import { EditorState, Fragment } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[Try adding one or more # at the beginning of this line and a space]`

const reduceToText = (fragments: Fragment[]): string => {
  return fragments.reduce((currentText, fragment) => {
    if ('fragments' in fragment) {
      return currentText + reduceToText(fragment.fragments)
    } else {
      return currentText + fragment.text
    }
  }, '')
}

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
        const text = reduceToText(block.fragments)

        if (text.startsWith('# ')) {
          return <h1 {...htmlAttrs}>{children}</h1>
        }

        if (text.startsWith('## ')) {
          return <h2 {...htmlAttrs}>{children}</h2>
        }

        if (text.startsWith('### ')) {
          return <h3 {...htmlAttrs}>{children}</h3>
        }

        if (text.startsWith('---')) {
          return <hr />
        }

        return <div {...htmlAttrs}>{children}</div>
      }}
      editorState={editorState}
    />
  );
}

export default App;
