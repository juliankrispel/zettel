import * as React from 'react'
import { Block, TextOrFragment, Text } from '@zettel/core'
import { RenderProps } from './types'

type TextProps = RenderProps & {
  block: Block,
}

const mapTextFramgent = (props: TextProps, offset: number, fragment: Text) => {
  const {
    block,
    renderStyle: RenderStyle,
    renderText: RenderText,
  } = props

  const key = `${block.blockKey}-${offset}`

  const { styles = [], text } = fragment

  const fragmentProps = props.readOnly ? {} : {
    key,
    'data-block-key': block.blockKey,
    'data-text': true,
    'data-start': offset,
    'data-end': offset + text.length
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

  if (RenderText) {
    textFragment = <RenderText
      fragment={fragment}
      data-text="true"
      key={`block-${block.blockKey}-${offset}`}
    >{textFragment}</RenderText>
  }

  return textFragment
}

const reduceFragments = (props: TextProps, _offset: number = 0, fragments: TextOrFragment[]): { rendered: any[], offset: number } => {
  const { block, renderFragment: RenderFragment } = props
  return fragments.reduce(
    ({ offset, rendered }, fragment) => {
      if ('fragments' in fragment && RenderFragment) {
          const reducedFragments = reduceFragments(props, offset + 1, fragment.fragments)

          const fragmentProps = props.readOnly ? {} : {
            key: `block-${block.blockKey}-${offset}-container-fragment`,
            'data-block-key': block.blockKey,
            'data-fragment': true,
            'data-start': offset,
            'data-end': reducedFragments.offset
          }
          
          const containerFragment = <RenderFragment
            fragment={fragment}
            {...fragmentProps}
          >
            <>{reducedFragments.rendered}</>
          </RenderFragment>
          return {
            rendered: rendered.concat([containerFragment]),
            offset: reducedFragments.offset + 1
          }
      } else {
        const _fragment = fragment as Text
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
    renderText: renderText,
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
      data-text="true"
      data-block-key={block.blockKey}
      data-start={0}
      data-end={0}
    ><br /></span>
  }

  return <>{textFragments}</>
}