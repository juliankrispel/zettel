import React, { Fragment, useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'
import createPersistedState from 'use-persisted-state';


const text = `[Italic][And Bold]`

type StyleDict = {
  [attr: string]: any
}

const defaultStyleDict: StyleDict = {}

const useStyleDict = (initialStyleDict=defaultStyleDict) => {
  const _useStyleDict = createPersistedState('elementStyles');
  const [styleDict, setStyleDict] = _useStyleDict(initialStyleDict);

  return [
    styleDict,
    (key: string, value: any) => setStyleDict({
      ...styleDict,
      [key]: value
    })
  ]
}


type CurrentStyle = string | ''

const initialCurrentStyle: CurrentStyle = ''

const App = () => {
  const [styleDict, setStyle] = useStyleDict()
  const [currentStyle, setCurrentStyle] = useState(initialCurrentStyle)
  const styleList = Object.keys(styleDict).map((key) => ({
    key,
    value: styleDict[key]
  }))

  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
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
  }))

  return (
    <Fragment>
      <section>
        <textarea onKeyDown={(event) => { console.log(event, setStyle, currentStyle)}} className="raw-input"></textarea>
        <ul>
          {styleList.map(item => (<li onClick={() => setCurrentStyle(item.key)}>
            {item.key} : {item.value}
          </li>))}
        </ul>
      </section>
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
            return editorState.toggleStyle('bold')
          } else if (event.key === 'i' && event.metaKey) {
            return editorState.toggleStyle('italic')
          } else if (event.key === 'u' && event.metaKey) {
            return editorState.toggleStyle('underline')
          }
        }}
        onChange={setEditorState}
        editorState={editorState}
      />
  </Fragment>
  );
}

export default App;
