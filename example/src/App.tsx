import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[One][][Two]`

const initialEditorState = EditorState.fromJSON({
  text,
  ranges: [{
    offset: 5,
    length: 1,
    styles: [],
    entity: '1'
  }],
  entityMap: {
    '1': {
      type: 'image',
      src: 'http://placekitten.com/100/100'
    }
  }
})

const App = () => {
  const [editorState, setEditorState] = useState(initialEditorState)

  console.log(editorState)
  return (
    <Editor
      renderBlock={(props) => {
        const entity = props.block.entity
        console.log('block', props.block.blockKey)
        if (entity != null && entity.type === 'image' && entity.src != null) {
          return <div key={props.block.blockKey} contentEditable={false}><img src={entity.src} /></div>
        }
        return <p key={props.block.blockKey}>{props.children}</p>
      }}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
