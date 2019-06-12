import React, { useRef, useState, useLayoutEffect } from 'react';
import './App.css';
import onKeyDown from './lib/handlers/onKeyDown'
import onPaste from './lib/handlers/onPaste'
import EditorState from './lib/EditorState'
import { Block } from './lib/types'
import setDomSelection from './lib/selection/setDomSelection'
import createTextFragments from './lib/createTextFragments'

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
        key: block.blockKey,
        'data-block-key': block.blockKey,
        'data-fragment-start': 0,
        'data-fragment-end': block.value.length,
      }

      let textFragment: React.ReactNode = <span
        {...fragmentProps}
      >{fragment.text || <br />}</span>

      /*
      if (RenderFragment) {
        textFragment = <RenderFragment
            data-block-key={key}
            key={key}
            fragment={fragment}
        >{textFragment}</RenderFragment>
      }
      */

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
    ranges: [],
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
