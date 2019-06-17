import { TextFragment, Block } from '@zettel/core'
import { CSSProperties } from 'react';

type FragmentRenderProps = {
  fragment: TextFragment
}

export type RenderStyle = React.FunctionComponent<{
  style: string,
  children: React.ReactElement
}>

export type RenderEntity = React.FunctionComponent<{
  entity: any,
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
  mapBlock?: (block: Block) => Block,
  renderBlock?: RenderBlock,
  renderChildren?: RenderChildren,
  renderStyle?: RenderStyle,
  renderEntity?: RenderEntity,
}  