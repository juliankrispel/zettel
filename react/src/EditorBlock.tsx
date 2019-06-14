import React, { CSSProperties } from 'react'
import { Block, EditorState } from '@zettel/core'
import EditorText from './EditorText'
import EditorChildren from './EditorChildren'
import { RenderProps } from './types'

type Props = RenderProps & {
  block: Block,
  editorState: EditorState
}

const style: CSSProperties = {
  WebkitUserModify: 'read-write-plaintext-only',
  position: 'relative',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  
}

export default function EditorBlock(props: Props) {
  const {
    block,
    editorState,
    ...renderProps
  } = props


  const content = <>
    <EditorText
      key="block-text"
      editorState={editorState}
      block={block}
      renderFragment={props.renderFragment}
     />
    {(props.block.blocks.length > 0) && (
      <EditorChildren
        blocks={props.block.blocks}
        editorState={props.editorState}
        {...renderProps}
      />
    )}
  </>

  const RenderBlock = renderProps.renderBlock

  if (RenderBlock != null) {
    return <RenderBlock style={style} block={block}>{content}</RenderBlock>
  }

  return content
}