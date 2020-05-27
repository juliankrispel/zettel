import * as React from 'react';
import { useState } from 'react'
import styled from 'styled-components'
import { EditorState, valueFromText, Value } from '@zettel/core'
import Editor from '@zettel/react'

const InlineImg = styled.img`
  display: inline-block;
  margin: 0;
  padding: 0;
  vertical-align: middle;
`

const list: Value = [
  ...valueFromText('[One'),
//    { type: 'fragment-start', data: { mention: 'something' } },
//    ...valueFromText('Two'),
//    { type: 'fragment-end' },
  { type: 'fragment-start', data: { img: 'http://placekitten.com/50/50' } },
  { type: 'fragment-end' },

  { type: 'fragment-start', data: { bg: 'blue' } },
  ...valueFromText('hello'),
  { type: 'fragment-end' },
  ...valueFromText('Three]'),
]

const App = () => {
  const [editorState, setEditorState] = useState(() => new EditorState({ value }))

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      renderTextFragment={(props) => {
        const { children, fragment } = props

        if ('img' in fragment.data) {
          return <InlineImg src={fragment.data.img} />
        }

        if ('bg' in fragment.data) {
          return <span style={{padding: '.3em', background: fragment.data.bg }}>
            {children}
          </span>
        }

        return <span>{children}</span>
      }}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
