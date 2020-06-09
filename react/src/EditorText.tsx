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

const reduceNodes = (props: TextProps, _offset: number = 0, fragments: TextOrFragment[]): { rendered: any[], offset: number } => {
  const { block, renderFragment: RenderFragment } = props
  // @ts-ignore
  return fragments.reduce(
    // @ts-ignore
    ({ offset, rendered }, fragment) => {
      if ('text' in fragment) {
        const renderedFragment = mapTextFramgent(props, offset, fragment)
        return {
          offset: offset + fragment.text.length,
          rendered: rendered.concat([renderedFragment])
        }
      } else if (RenderFragment != null) {
        const reducedFragments = reduceNodes(props, offset + 1, fragment.fragments)

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
        return null
      } 
    },
    // @ts-ignore
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

  if (block.value.length === 0 && block.fragments.length === 0) {
    textFragments = <span
      key={`text-fragments-${block.blockKey}`}
      data-text="true"
      data-block-key={block.blockKey}
      data-start={0}
      data-end={0}
    ><br /></span>

  } else {
    /*
    * If the block has content, split it up into fragments and render the fragments
    */
    // @ts-ignore
    textFragments = reduceNodes(props, 0, block.fragments).rendered
  /*
   * Render an empty block
   */
  }

  return <>{textFragments}</>
}