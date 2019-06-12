import React, { useLayoutEffect, useRef } from 'react'
import { EditorState, setDomSelection, onKeyDown, onPaste } from '@zettel/core'
import { RenderProps } from './types'
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
  overflowWrap: 'break-word',
  userSelect: 'text',
  outline: 'none'
}

const Editor = (props: Props) => {
  const {
    editorState,
    onChange,
    className,
    readOnly,
    style,
    ...renderProps
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
      onPaste={(event) => onChange(onPaste(editorState, event.nativeEvent))}
      ref={ref}
      {...divProps}
    >
      <EditorChildren
        blocks={editorState.tree.blocks}
        editorState={editorState}
        {...renderProps}
      />
    </div>
  );
}

export default Editor;