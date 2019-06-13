import React from 'react'
import { Block, EditorState } from '@zettel/core'
import EditorBlock from './EditorBlock'
import { RenderProps } from './types';

type Props = RenderProps & {
  blocks: Block[],
  block?: Block,
  editorState: EditorState
}

export default function EditorBlockChildren(props: Props) {
  const {
    blocks, block, editorState,
    ...renderProps
  } = props

  const {
    renderChildren: RenderChildren
  } = renderProps

  const content = <>{props.blocks.map(block => {
    return <EditorBlock
      editorState={props.editorState}
      key={block.blockKey}
      block={block}
      {...renderProps}
    />
  })}</>
  if (RenderChildren != null) {
    return <RenderChildren
      block={props.block}
      {...renderProps}
    >
      {content}
    </RenderChildren>

  }

  return content
}