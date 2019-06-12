import React, { useRef, useState, useLayoutEffect } from 'react';
import './App.css';
import {
  onKeyDown,
  onPaste,
  EditorState,
  setDomSelection,
  createTextFragments,
  Block,
} from '@zettel/core'


const editorStyles: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  userSelect: 'text',
  outline: 'none'
}

type TextProps = {
  block: Block,
  editorState: EditorState
}

const Text = (props: TextProps) => {
  const { block,  editorState } = props

  let offset = 0
  const fragments = createTextFragments(block, editorState.list.entityMap)

  /*
  return <div>
    <span {...fragmentProps}>
    {block.value.map(val => val.char).join('') || <br {...fragmentProps}/>}
    </span>
  </div>
  */
  let textFragments: React.ReactNode = text

  if (text != null && text.length > 0 && editorState != null) {
    const fragments = createTextFragments(block, editorState.list.entityMap)

    let offset = 0

    textFragments = fragments.map(fragment => {
      const fragmentProps = {
        key: `${block.blockKey}-${offset}`,
        'data-block-key': block.blockKey,
        'data-fragment-start': offset,
        'data-fragment-end': offset + fragment.text.length,
        className: fragment.styles.join(' ')
      }

      let textFragment: React.ReactNode = <span
        {...fragmentProps}
      >{fragment.text || <br />}</span>

      offset += fragment.text.length
      return textFragment
    })
  } else {
    textFragments = <span
      key={block.blockKey}
      data-block-key={block.blockKey}
      data-fragment-start={0}
      data-fragment-end={0}
    ><br /></span>
  }

  return <>{textFragments}</>
}

function Blocks({ blocks, editorState }: { blocks: Block[], editorState: EditorState }) {
  return <ul>{blocks.map(block => {
    return <BlockComp
      key={block.blockKey}
      block={block}
      editorState={editorState}
    />
  })}</ul>
}

const BlockComp = (props: {block: Block, editorState: EditorState}) => {
  return <li>
    <Text block={props.block} editorState={props.editorState} />
    {props.block.blocks.length > 0 && <Blocks blocks={props.block.blocks} editorState={props.editorState} /> }
  </li>
}

const text = `[Hello World
[This is evil
[Nesting
[Nestnig]]]]`

const App = () => {
  const [editorState, setEditorState] = useState(EditorState.fromJSON({
    text,
    ranges: [{
      offset: 3,
      length: 5,
      styles: ['bold']
    }, {
      offset: 7,
      length: 10,
      styles: ['italic']
    }],
    entityMap: {}
  }))

  const ref = useRef(null)

  useLayoutEffect(() => {
    const container = ref.current
    if (container != null) {
      setDomSelection(editorState, container)
    }
  })

  return (
    <div
      onKeyDown={(event) => setEditorState(onKeyDown(editorState, event.nativeEvent))}
      suppressContentEditableWarning
      style={editorStyles}
      onPaste={(event) => setEditorState(onPaste(editorState, event.nativeEvent))}
      ref={ref}
      contentEditable={true}
      >
      <Blocks blocks={editorState.tree.blocks} editorState={editorState} />
    </div>
  );
}

export default App;
