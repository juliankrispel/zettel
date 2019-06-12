import { TextFragment, Block } from '@zettel/core'

type FragmentRenderProps = {
  fragment: TextFragment
}

export type RenderFragment = React.FunctionComponent<{
  fragment: TextFragment,
  children: React.ReactElement
}>

export type RenderBlock = React.FunctionComponent<{
  block: Block,
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