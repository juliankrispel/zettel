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

  const htmlAttrs: any = {
    'data-block-key': block.blockKey,
    'data-fragment-start': 0,
    'data-fragment-end': block.value.length,
    style,
  }

  const { entity } = block

  if (entity != null && entity.isAtomic && RenderBlock != null) {
    const offset = 0

    return <RenderBlock 
      block={block}
      key={`${block.blockKey}-${offset}`}
      htmlAttrs={htmlAttrs}
      children={<>{null}</>}
    />
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