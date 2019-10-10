import React, { useLayoutEffect, useRef, useEffect, useMemo } from 'react'
import { EditorState, setDomSelection, onKeyDown, onPaste, onCut, onSelectionChange, onInput } from '@zettel/core'
import { RenderProps, RenderBlock } from './types'
import EditorChildren from './EditorChildren'

const _cb = (event: InputEvent) => {
  // debugger
  const {
    data,
    inputType,
    isComposing,
  } = event

  console.log({
    type: event.type,
    data,
    inputType,
    isComposing,
    // @ts-ignore
    range: getSelection().getRangeAt(0),
  });
  event.preventDefault()
  event.stopPropagation()
}


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

/**
 * Editor Component
 */
const Editor = (props: Props): React.ReactElement => {
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

  /*
  * we need to enforce our selection
  */
  useLayoutEffect(() => {
    const container = ref.current
    if (container != null) {
      setDomSelection(editorState, container)
    }
  })

  useLayoutEffect(() => {
    const el: any = ref != null ? ref.current : null
    if (el != null) {
      console.log('hello')
      // @ts-ignore

      const cb = (event: InputEvent) => {
        onChange(onInput(editorState, event))
      }

      el.addEventListener('beforeinput', cb)

      return () => {
        el.removeEventListener('beforeinput', cb)
      }
    }
 }, [ref.current])

  const divProps = {
    ...htmlAttrs,
    style: { ...editorStyles },
    contentEditable: readOnly === true ? false : true,
  }

  return (
    <div
      onSelect={() => {
        const newEditorState = onSelectionChange(editorState)
        const { start, end } = editorState

        if (newEditorState != null &&
          (start !== newEditorState.start|| end !== newEditorState.end)
        ) {
          onChange(newEditorState)
        }
      }}
      suppressContentEditableWarning
      role="textbox"
      autoCorrect={'off'}
      ref={ref}
      {...divProps}
    >
      <EditorChildren
        mapBlock={mapBlock}
        blocks={editorState.tree.blocks}
        renderBlock={renderBlock}
        renderTextFragment={renderEntity}
        renderStyle={renderStyle}
        renderChildren={renderChildren}
      />
    </div>
  );
}

export default Editor;