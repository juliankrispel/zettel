import React, { CSSProperties } from 'react'
import { Block, Value, EditorState } from '@zettel/core'
import EditorText from './EditorText'
import EditorChildren from './EditorChildren'
import { RenderProps } from './types'

type Props = RenderProps & {
  block: Block,
  editorState: EditorState
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
    editorState,
    mapBlock,
    ...renderProps
  } = props

  const RenderBlock = renderProps.renderBlock
  let block = _block

  if (mapBlock != null) {
    block = mapBlock(_block)
  }

  let htmlAttrs: any = {
    style,
  }

  const { entity } = block

  if (entity != null  && entity.isAtomic && RenderBlock != null) {
    const offset = 0
    htmlAttrs = {
      ...htmlAttrs,
      'data-block-key': block.blockKey,
      'data-fragment-start': offset,
      'data-fragment-end': offset + block.value.length
    }

    return <RenderBlock 
      block={block}
      key={`${block.blockKey}-${offset}`}
      htmlAttrs={htmlAttrs}
      children={<>null</>}
    />
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

  if (RenderBlock != null) {
    return <RenderBlock
      htmlAttrs={htmlAttrs}
      block={block}
    >{content}</RenderBlock>
  }

  return content
}