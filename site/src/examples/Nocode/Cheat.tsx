import React, { Fragment, useState } from 'react'
import { EditorState, getBlockForIndex } from '@zettel/core'
import createPersistedState from 'use-persisted-state';
import Editor from '@zettel/react'
import styled from 'styled-components'
import StyleEditor from './StyleEditor'
import './index.css'

const Container = styled.div`
  display: flex;
  padding: 0;
`

const text = '[One Line][Another Line]'
const useStyles = createPersistedState('element-styles')
const useEditorState = createPersistedState('editor-state')

const App = () => {
  const [styles, setStyles] = useStyles({})
  const [editorState, setEditorState] = useEditorState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  const onSelectStyle = (style: string) => {
    const { start, end, list } = editorState
    const isCollapsed = start === end
    const styleList = style ? [style] : []

    if (isCollapsed) {
      const { blockOffset } = getBlockForIndex(list.value, start)
      const value = [{
        ...list.value[blockOffset],
        styles: styleList
      }]
      setEditorState(
        editorState
          .change({ start: blockOffset - 1, end: blockOffset, value })
          .change({ start, end })
      )
    } else {
      const currentSelectedValue = list.value.slice(start + 1, end + 1)
      const value = currentSelectedValue.map(val => ({
        ...val,
        styles: styleList
      }))
      setEditorState(editorState.change({ value }))
    }
  }

  return (
    <Container>
      <Editor
        renderStyle={({ style, children }) => {
          const Fragment = styled.span`
          ${styles[style]}
          `

          return <Fragment>{children}</Fragment>
        }}
        renderBlock={({ block, children, htmlAttrs}) => {
          const [style] = block.styles
          console.log(block.styles)
          const Block = styled.div`
            ${styles[style]}
          `
          return <Block {...htmlAttrs}>
            {children}
          </Block>
        }}
        htmlAttrs={{ className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
      <StyleEditor onSelectStyle={onSelectStyle} styles={styles} onChange={setStyles} />
  </Container>
  );
}

export default App;
