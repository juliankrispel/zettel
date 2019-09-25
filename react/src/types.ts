import { TextFragment, Block, Entity } from '@editable/core'

type FragmentRenderProps = {
  fragment: TextFragment
}

/**
 * RenderStyle
 * 
 * 
 */
export type RenderStyle = React.FunctionComponent<{
  style: string,
  children: React.ReactElement
}>

export type RenderTextFragment = React.FunctionComponent<{
  entity: any,
  children: React.ReactElement
}>

export type RenderBlock = React.FunctionComponent<{
  block: Block,
  htmlAttrs: Object,
  children: React.ReactElement
}>

export type RenderChildren = React.FunctionComponent<{
  block?: Block,
  children: React.ReactElement
}>

export type RenderAtom = React.FunctionComponent<{
  block?: Block
  entity?: Entity
}>

export type RenderProps = {
  mapBlock?: (block: Block) => Block,
  renderBlock?: RenderBlock,
  renderChildren?: RenderChildren,
  renderStyle?: RenderStyle,
  renderTextFragment?: RenderTextFragment,
}  