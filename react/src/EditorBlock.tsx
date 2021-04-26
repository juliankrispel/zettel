import * as React from 'react'
import { Block } from '@zettel/core'
import EditorText from './EditorText'
import { RenderProps } from './types'

type Props = RenderProps & {
  block: Block
}

const style = {
  WebkitUserModify: 'read-write-plaintext-only',
  position: 'relative',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
}

export default function EditorBlock(props: Props) {
  const {
    block: _block,
    ...renderProps
  } = props

  const RenderBlock = renderProps.renderBlock
  let block = _block

  let htmlAttrs: any = {}

  if (!props.readOnly) {
    htmlAttrs = {
      'data-block-key': block.blockKey,
      'data-start': 0,
      'data-end': block.value.length,
      style,
    }
  }

  const content = <>
    <EditorText
      key="block-text"
      block={block}
      {...renderProps}
     />
  </>

  if (RenderBlock != null) {
    return <RenderBlock
      htmlAttrs={htmlAttrs}
      block={block}
      {...renderProps}
    >{content}</RenderBlock>
  }

  return content
}