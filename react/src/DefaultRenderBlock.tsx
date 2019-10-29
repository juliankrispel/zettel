import React from 'react'
import { RenderBlock } from './types'
import EditorChildren from './EditorChildren'

const DefaultRenderBlock: RenderBlock = ({
  htmlAttrs,
  children,
  block,
  ...renderProps
}) => {
  return <div {...htmlAttrs}>
    {children}
    {(block.blocks.length > 0) && (
      <EditorChildren
        blocks={block.blocks}
        renderBlock={DefaultRenderBlock}
        {...renderProps}
      />
    )}
  </div>
}

export default DefaultRenderBlock