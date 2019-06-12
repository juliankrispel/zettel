import { Block, EditorState } from '@zettel/core'
import EditorBlock from './EditorBlock'
import { RenderProps } from './types';

type Props = RenderProps & {
  blocks: Block[],
  block?: Block,
  editorState: EditorState
}

export default function EditorBlockChildren(props: Props) {
  const {
    renderChildren: RenderChildren
  } = props

  const content = <>{props.blocks.map(block => {
    return <EditorBlock
      editorState={props.editorState}
      key={block.blockKey}
      block={block}
    />
  })}</>
  if (RenderChildren != null) {
    return <RenderChildren
      block={props.block}
    >
      {content}
    </RenderChildren>

  }

  return content
}