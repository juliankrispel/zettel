import React, { useLayoutEffect, useRef } from 'react'
import { Value, EditorState, setDomSelection, onKeyDown, onPaste, onInput } from '@zettel/core'
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
    mapBlock,
    readOnly,
    style,
    renderEntity,
    renderStyle,
    renderBlock = DefaultRenderBlock,
    renderChildren,
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
      onKeyDown={(event) => {
       const result = onKeyDown(editorState, event.nativeEvent)
       if (result != null) {
         event.preventDefault()
         onChange(result)
       }
      }}
      onInput={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onBeforeInput={(event) => {
        /*
        * TODO: Investigate input events
        * For now I'm blocking these to avoid content
        * and selection to get out of place
        */
        event.preventDefault()
        event.stopPropagation()
      }}
      suppressContentEditableWarning
      role="textbox"
      autoCorrect={'off'}
      onPaste={(event) => onChange(onPaste(editorState, event.nativeEvent))}
      ref={ref}
      {...divProps}
    >
      <EditorChildren
        mapBlock={mapBlock}
        blocks={editorState.tree.blocks}
        editorState={editorState}
        renderBlock={renderBlock}
        renderEntity={renderEntity}
        renderStyle={renderStyle}
        renderChildren={renderChildren}
      />
    </div>
  );
}

export default Editor;