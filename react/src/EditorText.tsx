import React from 'react'
import {
  Block,
  TextFragment,
} from '@editable/core'

import { RenderProps, RenderStyle } from './types'

type TextProps = RenderProps & {
  block: Block,
}

type FragmentRenderProps = {
  fragment: TextFragment
}

export default function EditorText(props: TextProps) {
  const {
    block,
    renderStyle: RenderStyle,
    renderTextFragment: RenderTextFragment,
  } = props

  let offset = 0

  let textFragments: React.ReactNode = null

  if (block.value.length > 0) {
    /*
    * If the block has content, split it up into fragments and render the fragments
    */
    const { fragments } = block

    let offset = 0

    textFragments = fragments.map(fragment => {
      const fragmentProps = {
        key: `${block.blockKey}-${offset}`,
        'data-block-key': block.blockKey,
        'data-fragment-start': offset,
        'data-fragment-end': offset + fragment.text.length
      }

      let textFragment: React.ReactElement = fragment.styles.reduce((children, val) => {
        if (RenderStyle != null) {
          return <RenderStyle key={`${fragmentProps.key}-${val}`} style={val}>{children}</RenderStyle>
        } else {
          return children
        }
      }, <span
          {...fragmentProps}
          key={`fragment-${block.blockKey}-${offset}`}
        >{fragment.text || <br />}
      </span>)
      

      if (RenderTextFragment) {
        textFragment = <RenderTextFragment
          entity={fragment.entity}
          key={`entity-${block.blockKey}-${offset}`}
        >{textFragment}</RenderTextFragment>
      }

      offset += fragment.text.length
      return textFragment
    })
  /*
   * Render an empty block
   */
  } else {
    textFragments = <span
      key={`text-fragments-${block.blockKey}`}
      data-block-key={block.blockKey}
      data-fragment-start={0}
      data-fragment-end={0}
    ><br /></span>
  }

  return <>{textFragments}</>
}