import React, { useLayoutEffect, useRef, useState, useMemo } from 'react'
import {
  EditorState,
  setDomSelection,
  createViewState,
  onKeyDown,
  ViewState,
  onBeforeInput,
  onSelectionChange
} from '@zettel/core'
import { RenderProps, RenderBlock } from './types'
import EditorChildren from './EditorChildren'

type Props = RenderProps & {
  onChange: (editorState: EditorState) => void,
  editorState: EditorState,
  viewState?: ViewState,
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
    editorState: _editorState,
    onChange,
    readOnly,
    htmlAttrs,
    renderTextFragment: renderEntity,
    renderStyle,
    renderBlock = DefaultRenderBlock,
    renderChildren,
  } = props

  const ref = useRef(null)
  const [isComposing, setComposing] = useState(false)
  const editorState = useMemo(() => _editorState, [isComposing || _editorState])

  /*
  * we need to enforce our selection
  */
  useLayoutEffect(() => {
    const container = ref.current
    if (container != null) {
      setDomSelection(editorState, container)
    }
  }, [editorState])

  useLayoutEffect(() => {
    const el: any = ref != null ? ref.current : null
    if (el != null) {
      // @ts-ignore
      const beforeinput = (event: InputEvent) => {
        onChange(onBeforeInput(editorState, event))
      }

      el.addEventListener('beforeinput', beforeinput)
      return () => {
        el.removeEventListener('beforeinput', beforeinput)
      }
    }
 }, [ref.current, editorState])

  const divProps = {
    ...htmlAttrs,
    style: { ...editorStyles },
    contentEditable: readOnly === true ? false : true,
  }

  const viewState = props.viewState || useMemo(() => createViewState(editorState.list), [editorState])

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
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => setComposing(false)}
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
      suppressContentEditableWarning
      role="textbox"
      autoCorrect={'off'}
      ref={ref}
      {...divProps}
    >
      <EditorChildren
        blocks={viewState.blocks}
        renderBlock={renderBlock}
        renderTextFragment={renderEntity}
        renderStyle={renderStyle}
        renderChildren={renderChildren}
      />
    </div>
  );
}

export default Editor;