import * as React from 'react';
import { useState } from 'react'
import { EditorState, getBlocksForRange } from '@zettel/core'
import Editor from '@zettel/react'
import { Button } from '../../components'

const text = `[Headline 1][Headline 2][A paragraph]`

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [{
      offset: 0,
      length: 1,
      styles: ['H1']
    }, {
      offset: 12,
      length: 1,
      styles: ['H2']
    }],
    entityMap: {}
  }))

  return (
    <>
      <div>
        <Button onClick={() => {
          const blocks = getBlocksForRange(editorState.list.value, editorState.start, editorState.end)
          const { start, end } = editorState

          const _editorState = blocks.reduce((newEditorState, block) => {
            // @ts-ignore
            const value: BlockStart = newEditorState.list.value[block.blockOffset]
            return newEditorState.change({
              start: block.blockOffset - 1,
              end: block.blockOffset,
              value: [{
                ...value,
                styles: (value.styles || []).includes('H1') ? [] : ['H1'],
              }]
            })
          }, editorState)
          .change({ start, end, isBoundary: true })
          setEditorState(_editorState)
        }}>
          H1
        </Button>
      </div>
      <Editor
        renderBlock={(props) => {
          const { htmlAttrs, children, block } = props
          if (block.styles != null) {
            if (block.styles.includes('H1')) {
              return <h1 {...htmlAttrs}>{children}</h1>
            } else if (block.styles.includes('H2')) {
              return <h2 {...htmlAttrs}>{children}</h2>
            }
          }
          return <div {...htmlAttrs}>{children}</div>
        }}
        htmlAttrs={{ className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
    </>
  );
}

export default App;
