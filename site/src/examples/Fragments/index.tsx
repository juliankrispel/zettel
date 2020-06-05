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

// @ts-ignore
const RenderTextFragment = React.memo((props) => {
  // @ts-ignore
  const { children, fragment, ...fragmentProps } = props

  if ('img' in fragment.data) {
    return <InlineImg {...fragmentProps} src={fragment.data.img} />
  }

  if ('text' in fragment.data) {
    return <span {...fragmentProps}>{fragment.data.text}</span>
  }

  if ('bg' in fragment.data) {
    return <span {...fragmentProps} style={{padding: '.3em', background: fragment.data.bg }}>
      {children}
    </span>
  }

  return <span {...fragmentProps}>{children}</span>
})

const value: Value = [
    ...valueFromText('[One'),
//    { type: 'fragment-start', data: { mention: 'something' } },
//    ...valueFromText('Two'),
//    { type: 'fragment-end' },
  { type: 'fragment-start', data: { img: 'http://placekitten.com/50/50' } },
  { type: 'fragment-end' },
  { type: 'fragment-start', data: { text: 'Something' } },
  { type: 'fragment-end' },
  ...valueFromText('hello'),
  { type: 'fragment-start', data: { bg: 'blue' } },
  ...valueFromText('hello'),
  { type: 'fragment-end' },
  ...valueFromText('Three]'),
  ...valueFromText('[A'),
  { type: 'fragment-start', data: { img: 'http://placekitten.com/30/30' } },
  { type: 'fragment-end' },
  { type: 'fragment-start', data: { img: 'http://placekitten.com/30/30' } },
  { type: 'fragment-end' },
  { type: 'fragment-start', data: { img: 'http://placekitten.com/30/30' } },
  { type: 'fragment-end' },
  ...valueFromText(']'),
]

const App = () => {
  const [editorState, setEditorState] = useState(() => new EditorState({ value }))

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      renderTextFragment={RenderTextFragment}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
