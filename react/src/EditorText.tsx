import * as React from 'react'
import { Block, Fragment, TextFragment, ContainerFragment } from '@zettel/core'
import { RenderProps } from './types'

type TextProps = RenderProps & {
  block: Block,
}

const mapTextFramgent = (props: TextProps, offset: number, fragment: TextFragment) => {
  const {
    block,
    renderStyle: RenderStyle,
    renderTextFragment: RenderTextFragment,
  } = props

  const key = `${block.blockKey}-${offset}`

  const { styles = [], text } = fragment

  const fragmentProps = props.readOnly ? {} : {
    key,
    'data-block-key': block.blockKey,
    'data-text-fragment': true,
    'data-fragment-start': offset,
    'data-fragment-end': offset + text.length
  }

  const fragmentText: any = text

  let textFragment: React.ReactElement = styles.reduce((children, val) => {
    if (RenderStyle != null) {
      return <RenderStyle key={`${fragmentProps.key}-${val}`} style={val}>{children}</RenderStyle>
    } else {
      return children
    }
  }, <span
      {...fragmentProps}
      key={`fragment-${block.blockKey}-${offset}`}
    >{fragmentText}
  </span>)

  if (RenderTextFragment) {
    textFragment = <RenderTextFragment
      fragment={fragment}
      data-text-fragment="true"
      key={`block-${block.blockKey}-${offset}`}
    >{textFragment}</RenderTextFragment>
  }

  return textFragment
}

const reduceFragments = (props: TextProps, _offset: number = 0, fragments: Fragment[]): { rendered: any[], offset: number } => {
  const { block, renderTextFragment: RenderTextFragment } = props
  return fragments.reduce(
    ({ offset, rendered }, fragment) => {
      if ('fragments' in fragment && RenderTextFragment) {
          const reducedFragments = reduceFragments(props, offset + 1, fragment.fragments)
          const containerFragment = <RenderTextFragment
            fragment={fragment}
            data-text-fragment="true"
            key={`block-${block.blockKey}-${offset}-container-fragment`}
          >
            <>{reducedFragments.rendered}</>
          </RenderTextFragment>
          return {
            rendered: rendered.concat([containerFragment]),
            offset: reducedFragments.offset + 1
          }
      } else {
        const _fragment = fragment as TextFragment
        const renderedFragment = mapTextFramgent(props, offset, _fragment)
        return {
          offset: offset + _fragment.text.length,
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

  if (block.value.length > 0) {
    /*
    * If the block has content, split it up into fragments and render the fragments
    */
    textFragments = reduceFragments(props, 0, block.fragments).rendered
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