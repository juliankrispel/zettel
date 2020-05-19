import * as React from 'react'
import { Block, Fragment, TextFragment } from '@zettel/core'
import { RenderProps } from './types'

type TextProps = RenderProps & {
  block: Block,
}
console.log('what')

const mapTextFramgent = (props: TextProps, offset: number, fragment: TextFragment) => {
  const {
    block,
    renderStyle: RenderStyle,
    renderTextFragment: RenderTextFragment,
  } = props

  const fragmentProps = {
    key: `${block.blockKey}-${offset}`,
    'data-block-key': block.blockKey,
    'data-text-fragment': true,
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
      data-text-fragment="true"
      entity={fragment.entity}
      key={`entity-${block.blockKey}-${offset}`}
    >{textFragment}</RenderTextFragment>
  }

  return textFragment
}

const reduceFragments = (props: TextProps, _offset: number = 0, fragments: Fragment[]): { rendered: any[], offset: number } => {
  console.log('reduce fragments??')
  return fragments.reduce(
    ({ offset, rendered }, fragment) => {
      if ('fragments' in fragment) {
        const reducedFragments = reduceFragments(props, offset, fragment.fragments)

        console.log('fragments')
        return {
          rendered: rendered.concat([reducedFragments.rendered]),
          offset: offset + reducedFragments.offset
        }
      } else {
        const renderedFragment = mapTextFramgent(props, offset, fragment)
        console.log('fragment')
        return {
          offset: offset + fragment.text.length,
          rendered: rendered.concat([renderedFragment])
        }
      }
    },
    { offset: _offset, rendered: ([] as any[]) }
  )
}

export default function EditorText(props: TextProps) {
  const {
    block,
    renderStyle: RenderStyle,
    renderTextFragment: RenderTextFragment,
  } = props

  let textFragments: React.ReactNode = null

  console.log('editor text?', block)
  if (block.value.length > 0) {
    /*
    * If the block has content, split it up into fragments and render the fragments
    */
    textFragments = reduceFragments(props, 0, block.fragments).rendered
    console.log(textFragments)
  /*
   * Render an empty block
   */
  } else {
    textFragments = <span
      key={`text-fragments-${block.blockKey}`}
      data-text-fragment="true"
      data-block-key={block.blockKey}
      data-fragment-start={0}
      data-fragment-end={0}
    ><br /></span>
  }

  return <>{textFragments}</>
}