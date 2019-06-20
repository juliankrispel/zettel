import React, { useLayoutEffect, useRef } from 'react'
import { EditorState, setDomSelection, onKeyDown, onPaste, onSelectionChange } from '@zettel/core'
import { RenderProps, RenderBlock } from './types'
import EditorChildren from './EditorChildren'

type Props = RenderProps & {
  onChange: (editorState: EditorState) => void,
  editorState: EditorState,
  htmlAttrs?: Object,
  onKeyDown?: (event: React.KeyboardEvent) => EditorState | void,
  readOnly?: boolean,
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

const DefaultRenderBlock: RenderBlock = (props) => <div {...props.htmlAttrs}>{props.children}</div>

const Editor = (props: Props) => {
  const {
    editorState,
    onChange,
    mapBlock,
    readOnly,
    htmlAttrs,
    renderTextFragment: renderEntity,
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
    ...htmlAttrs,
    style: { ...editorStyles },
    contentEditable: readOnly === true ? false : true,
  }

  return (
    <div
      onKeyDown={(event) => {
        let handled = null

        if (props.onKeyDown != null) {
          handled = props.onKeyDown(event)
        }

        if (handled == null) {
          handled = onKeyDown(editorState, event.nativeEvent)
        }

        if (handled != null) {
          event.preventDefault()
          onChange(handled)
        }
      }}
      onSelect={() => {
        const newEditorState = onSelectionChange(editorState)
        const { start: newStart, end: newEnd } = newEditorState
        const { start, end } = editorState

        if (newEditorState != null &&
          (start !== newStart || end !== newEnd)
        ) {
          onChange(newEditorState)
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
        renderTextFragment={renderEntity}
        renderStyle={renderStyle}
        renderChildren={renderChildren}
      />
    </div>
  );
}

export default Editor;