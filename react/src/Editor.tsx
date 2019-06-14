import React, { useLayoutEffect, useRef } from 'react'
import { EditorState, setDomSelection, onKeyDown, onPaste } from '@zettel/core'
import { RenderProps, RenderBlock } from './types'
import EditorChildren from './EditorChildren'

type Props = RenderProps & {
  onChange: (editorState: EditorState) => void,
  editorState: EditorState,
  readOnly?: boolean,
  className?: string,
  style?: React.CSSProperties,
}

const editorStyles: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  WebkitUserModify: 'read-write-plaintext-only',
  // @ts-ignore
  WebkitLineBreak: 'after-white-space',
  overflowWrap: 'break-word',
  userSelect: 'text',
  outline: 'none'
}

const DefaultRenderBlock: RenderBlock = (props) => <div style={props.style}>{props.children}</div>

const Editor = (props: Props) => {
  const {
    editorState,
    onChange,
    className,
    readOnly,
    style,
    renderBlock = DefaultRenderBlock,
    renderChildren,
    renderFragment
  } = props

  const ref = useRef(null)

  useLayoutEffect(() => {
    const container = ref.current
    if (container != null) {
      setDomSelection(editorState, container)
    }
  })

  const divProps = {
    style: { editorStyles, ...(style || {}) },
    contentEditable: readOnly === true ? false : true,
    className,
  }

  return (
    <div
      onKeyDown={(event) => onChange(onKeyDown(editorState, event.nativeEvent))}

      suppressContentEditableWarning
      role="textbox"
      autoCorrect={'off'}
      onPaste={(event) => onChange(onPaste(editorState, event.nativeEvent))}
      ref={ref}
      {...divProps}
    >
      <EditorChildren
        blocks={editorState.tree.blocks}
        editorState={editorState}
        renderBlock={renderBlock}
        renderChildren={renderChildren}
        renderFragment={renderFragment}
      />
    </div>
  );
}

export default Editor;