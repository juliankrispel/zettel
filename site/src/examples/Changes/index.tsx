import * as React from 'react';
import { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  padding: 0;
  height: 100%;
`

const Error = styled.span`
  color: #f00;
  font-weight: bold;
  font-size: .8em;
`

const Aside = styled.aside`
  position: relative;
  border-top: 1px solid #ccc;
  padding: .8em;
  height: 100%;
  width: 400px;
  background: #f0f0f0;
  border-left: 1px solid #ccc;

  input, select, textarea, button {
    width: 100%;
    margin-bottom: 1em;
    font-size: 0.8em;
    border-radius: 3px;
    outline: none;
  }

  input {
    padding: .3em;
    border: 1px solid #ccc;
  }

  textarea {
    min-height: 300px;
    white-space: pre;
    border: none;
    padding: .5em;
    border: 1px solid #ccc;
    font-family: monospace;
  }

  label {
    display: flex;
    width: 100%;
  }

  select {
    margin-right: 1em;
  }

  button {
    width: auto;
    background: #000;
    padding: .3em .5em;
    border: none;
    color: #fff;
  }
`

const text = `[One 😅Line][And another line of text][And another line]`

const App = () => {
  const [currentChanges, setCurrentChanges] = useState(`[{
  "start": 3,
  "end": 3,
  "value": [{
    "char": "🔥"
  }]
}]`)
  const [hasError, setHasError] = useState(false)
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  const onChangeChange = (event: any) => {
    setHasError(false)
    setCurrentChanges(event.target.value)
  }

  const submitChange = () => {
    try {
      const changes = JSON.parse(currentChanges)
      if (!Array.isArray(changes)) {
        // @ts-ignore
        throw new Error("SO DUMB")
      }
      let newEditorState = editorState
      changes.forEach(change => {
        newEditorState = editorState.change(change)
      })
      setEditorState(newEditorState)
    } catch (err) {
      setHasError(true)
    }
  }

  return (
    <Container>
      <Editor
        htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
      <Aside>
        {hasError && <Error>Your JSON sucks, fix it</Error>}
        <textarea
        onKeyDown={(event: any) => {
          if (event.key === 'Enter' && event.metaKey) {
            submitChange()
          }
        }}
        onChange={onChangeChange} value={currentChanges}/>
        <button onClick={submitChange}>Change</button>
      </Aside>
    </Container>
  );
}

export default App;
