import React, { useState } from 'react';
import './App.css';
import onKeyDown from './lib/handlers/onKeyDown'
import EditorState from './lib/EditorState'
import { Block } from './lib/types'

const Text = (props: Block) => {
  return <div >
    <span
      data-block-key={props.blockKey}
      data-fragment-start="0"
    >
    {props.value.map(val => val.char).join('')}
    </span>
  </div>
}

const BlockComp = (props: Block) => {
  return <li>
    <Text {...props} />
    {props.blocks.length > 0 && <Blocks blocks={props.blocks} /> }
  </li>
}

const Blocks = ({ blocks }: { blocks: Block[]}) => {
  return <ul>{blocks.map(block => {
    return <BlockComp
      key={block.blockKey}
      {...block}
    />
  })}</ul>
}

const text = `[Hello World
[This is evil
[Nesting
[Nestnig]]]]`

const App = () => {
  const [editorState, setEditorState] = useState(EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  return (
    <div
      onKeyDown={(event) => setEditorState(onKeyDown(editorState, event.nativeEvent))}
      suppressContentEditableWarning
      contentEditable={true}
      >
      <Blocks blocks={editorState.tree.blocks} />
    </div>
  );
}

export default App;
