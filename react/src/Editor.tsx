import * as React from 'react';
import { useLayoutEffect, useRef, useState, useMemo } from 'react'
import {
  EditorState,
  setDomSelection,
  createViewState,
  onKeyDown,
  ViewState,
  onBeforeInput,
  onSelectionChange,
  toText
} from '@zettel/core'
import DefaultRenderBlock from './DefaultRenderBlock'
import { RenderProps } from './types'
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

/**
 * Editor Component
 */
const Editor = (props: Props): React.ReactElement => {
  const {
    editorState: _editorState,
    onChange: _onChange,
    readOnly,
    htmlAttrs,
    renderTextFragment,
    renderStyle,
    renderBlock = DefaultRenderBlock,
    renderChildren,
  } = props

  const onChange = (args: any) => {
    _onChange(args)
  }

  const ref = useRef(null)
  const [isComposing, setComposing] = useState(false)
  const editorState = _editorState

  /*
  * we need to enforce our election
  */
  useLayoutEffect(() => {
    const container = ref.current
    if (container != null && !isComposing) {
      setDomSelection(editorState, container)
    }
  }, [editorState])

  useLayoutEffect(() => {
    const el: any = ref != null ? ref.current : null
    if (el != null) {
      // @ts-ignore
      const beforeinput = (event: InputEvent) => {
        const newEditorState = onBeforeInput(editorState, event)
        if (newEditorState != null) {
          onChange(newEditorState)
        }
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

  const viewState = props.viewState || useMemo(() => createViewState(editorState.list), [isComposing || editorState])
  console.log(viewState)
  const children = <EditorChildren
    blocks={viewState.blocks}
    renderBlock={renderBlock}
    renderTextFragment={renderTextFragment}
    renderStyle={renderStyle}
    renderChildren={renderChildren}
  />

  return (
    <div
      onSelect={() => {
        const newEditorState = onSelectionChange(editorState)
        const { start, end } = editorState

        if (newEditorState != null &&
          (start !== newEditorState.start|| end !== newEditorState.end)
          && !isComposing
        ) {
          onChange(newEditorState)
        }
      }}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => {
        onChange(onSelectionChange(editorState))
        setComposing(false)
      }}
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
          onChange(onSelectionChange(editorState))
          onChange(handled)
        }
      }}
      suppressContentEditableWarning
      role="textbox"
      autoCorrect={'off'}
      ref={ref}
      {...divProps}
    >
      {children}
    </div>
  );
}

export default Editor;