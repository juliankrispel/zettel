import { TextFragment, Block } from '@zettel/core'
import { CSSProperties } from 'react';

type FragmentRenderProps = {
  fragment: TextFragment
}

export type RenderFragment = React.FunctionComponent<{
  fragment: TextFragment,
  children: React.ReactElement
}>

export type RenderBlock = React.FunctionComponent<{
  block: Block,
  style: CSSProperties,
  children: React.ReactElement
}>

export type RenderChildren = React.FunctionComponent<{
  block?: Block,
  children: React.ReactElement
}>

export type RenderProps = {
  renderBlock?: RenderBlock,
  renderChildren?: RenderChildren,
  renderFragment?: RenderFragment
}  