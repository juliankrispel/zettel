import React, { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor, { RenderBlock, EditorChildren, DefaultRenderBlock } from '@zettel/react'
import './index.css'

const text = `[[[One][Two]][[Three][Four]]][And a paragraph]`

const ranges = [{
  offset: 0,
  length: 1,
  styles: [],
  entity: '1'
}]

const entityMap = {
  '1': {
    type: 'table'
  }
}

const CellBlock: RenderBlock = (props) => {
  const { htmlAttrs, children } = props

  return <td {...htmlAttrs}>
    {children}
  </td>
}

const RowBlock: RenderBlock = (props) => {
  const { htmlAttrs, block } = props

  return <tr {...htmlAttrs}>
    <EditorChildren
      {...props}
      renderBlock={CellBlock}
      blocks={block.blocks}
    />
  </tr>

}

// @ts-ignore
const TableBlock: RenderBlock = (props) => {
  const { htmlAttrs, block } = props
  const { entity } = block

  if (entity != null && entity.type === 'table') {
    return <table {...htmlAttrs}>
      <EditorChildren
        {...props}
        renderBlock={RowBlock}
        blocks={block.blocks}
      />
    </table>
  }

  return <DefaultRenderBlock {...props}/>
}

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges,
    entityMap
  }))


  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      renderBlock={TableBlock}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
