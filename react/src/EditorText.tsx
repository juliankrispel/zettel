import React from 'react'
import {
  EditorState,
  createTextFragments,
  Block,
  TextFragment,
} from '@zettel/core'

import { RenderProps, RenderStyle } from './types'

type TextProps = RenderProps & {
  block: Block,
  editorState: EditorState,
}

type FragmentRenderProps = {
  fragment: TextFragment
}

export default function EditorText(props: TextProps) {
  const {
    block,
    editorState,
    renderStyle: RenderStyle,
    renderTextFragment: RenderTextFragment,
  } = props

  let offset = 0

  let textFragments: React.ReactNode = null

  if (block.value.length > 0 && editorState != null) {
    const fragments = createTextFragments(block, editorState.list.entityMap)

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