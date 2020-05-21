import * as React from 'react'
import { Block } from '@zettel/core'
import EditorBlock from './EditorBlock'
import { RenderProps } from './types'
import { Value } from '@zettel/core'

type Props = RenderProps & {
  mapBlockValue?: (val: Value) => Value,
  blocks: Block[],
  block?: Block
}

export default function EditorBlockChildren(props: Props) {
  const {
    blocks,
    block,
    readOnly,
    ...renderProps
  } = props

  const {
    renderChildren: RenderChildren
  } = renderProps

  const content = <>{props.blocks.map(block => 
    <EditorBlock
      key={block.blockKey}
      block={block}
      readOnly={readOnly}
      {...renderProps}
    />,
  )}</>

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