import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor, { RenderBlock } from '@zettel/react'

const text = `[One][][Two]`

const Block: RenderBlock = React.memo((props) => {
  const { block, htmlAttrs } = props
  const entity = block.entity
  if (entity != null && entity.type === 'image' && entity.src != null) {
    return <div key={props.block.blockKey} contentEditable={false}><img src={entity.src} /></div>
  }
  return <p key={props.block.blockKey}>{props.children}</p>
})

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [{
      offset: 5,
      length: 1,
      styles: [],
      entity: '1'
    }, {
      offset: 8,
      length: 3,
      styles: [],
      entity: '2'
    }],
    entityMap: {
      '1': {
        isAtomic: true,
        type: 'image',
        src: 'http://placekitten.com/100/100'
      },
      '2': {
        isAtomic: false,
        type: 'link',
        htmlAttributes: {
          target: '_blank',
          href: 'http://www.google.com'
        }
      }
    }
  }))

  console.log(editorState)
  return (
    <Editor
      renderTextFragment={(props) => {
        console.log(props.entity)
        if (props.entity != null && props.entity.type === 'link') {
          return <a
            {...props.entity.htmlAttributes}
          >{props.children}</a>
        }

        return props.children
      }}
      htmlAttrs={{ className: 'editor'}}
      renderBlock={Block}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
