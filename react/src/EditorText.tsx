import React from 'react'
import {
  EditorState,
  createTextFragments,
  Block,
  TextFragment,
} from '@zettel/core'

import { RenderProps } from './types'

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
    renderFragment: RenderFragment
  } = props

  let offset = 0
  const fragments = createTextFragments(block, editorState.list.entityMap)

  let textFragments: React.ReactNode = null

  if (block.value.length > 0 && editorState != null) {
    const fragments = createTextFragments(block, editorState.list.entityMap)

    let offset = 0

    textFragments = fragments.map(fragment => {
      const fragmentProps = {
        key: `${block.blockKey}-${offset}`,
        'data-block-key': block.blockKey,
        'data-fragment-start': offset,
        'data-fragment-end': offset + fragment.text.length,
        className: fragment.styles.join(' ')
      }

      let textFragment: React.ReactElement = <span
        {...fragmentProps}
      >{fragment.text || <br />}</span>

      if (RenderFragment) {
        textFragment = <RenderFragment
            key={`${block.blockKey}-${offset}`}
            fragment={fragment}
        >{textFragment}</RenderFragment>
      }
 
      offset += fragment.text.length
      return textFragment
    })
  } else {
    textFragments = <span
      key={block.blockKey}
      data-block-key={block.blockKey}
      data-fragment-start={0}
      data-fragment-end={0}
    ><br /></span>
  }

  return <>{textFragments}</>
}