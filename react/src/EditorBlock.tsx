import React, { CSSProperties } from 'react'
import { Block, Value, EditorState } from '@zettel/core'
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
    block: _block,
    editorState,
    mapBlock,
    ...renderProps
  } = props

  let block = _block

  if (mapBlock != null) {
    block = mapBlock(_block)
  }

  const content = <>
    <EditorText
      key="block-text"
      editorState={editorState}
      mapBlock={props.mapBlock}
      block={block}
      {...renderProps}
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