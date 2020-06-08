import { Text, Block, Fragment } from '@zettel/core'

/**
 * RenderStyle
 * 
 * 
 */
export type RenderStyle = React.FunctionComponent<{
  style: string,
  children: React.ReactElement
}>

export type RenderText = React.FunctionComponent<{
  fragment: Text,
  fragmentProps?: any,
  children: React.ReactElement
}>

export type RenderFragment = React.FunctionComponent<{
  fragment: Fragment,
  fragmentProps?: any,
  children: React.ReactElement
}>


export type RenderBlock = React.FunctionComponent<{
  block: Block,
  htmlAttrs: Object,
  readOnly?: boolean,
  children: React.ReactElement
}>

export type RenderChildren = React.FunctionComponent<{
  block?: Block,
  children: React.ReactElement
}>

export type RenderAtom = React.FunctionComponent<{
  block?: Block
}>

export type RenderProps = {
  readOnly?: boolean,
  mapBlock?: (block: Block) => Block,
  renderBlock?: RenderBlock,
  renderChildren?: RenderChildren,
  renderStyle?: RenderStyle,
  renderText?: RenderText,
  renderFragment?: RenderFragment,
}  