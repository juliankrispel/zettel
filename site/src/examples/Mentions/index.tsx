import * as React from 'react';
import { useState } from 'react'
import { EditorState, getBlockText, getBlockForIndex, Value, valueFromText } from '@zettel/core'
import styled from 'styled-components'
import Editor from '@zettel/react'
// @ts-ignore
import Popover from 'react-text-selection-popover'
// @ts-ignore
import placeRightBelow from 'react-text-selection-popover/lib/placeRightBelow'
import { useLayoutEffect } from 'react';

const MentionsPopover = styled.ul`
  padding: 0;
  font-size: 0.8em;
  margin: 0;
  background: white;
  border: 1px solid;
  list-style-type: none;
  & > li {
    padding: 0.1em 0.5em;
    margin: 0;
    cursor: pointer;
    &:hover {
      background: #f0f0f0;

    }
  }
`

const text = `[One 😅Line][And another line of text][And another line]`

const App = () => {
  const mentions = [
    'Julian',
    'Bogdan',
    'Mark'
  ]

  const [filter, setFilter] = useState(null as string | null)
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
  }))
  const matchingMentions = mentions.filter(ment => ment.toLowerCase().startsWith(filter?.toLowerCase() || ''))
  const { start, end } = editorState
  const isOpen = filter !== null
  const isCollapsed = start === end

  const insertMention = (mention: string) => {
    const value: Value = [
      { type: 'fragment-start', data: { mention }},
      ...valueFromText(mention),
      { type: 'fragment-end'}
    ]
    setEditorState(editorState.change({
      start,
      end,
      value
    }))
  }

  useLayoutEffect(() => {
    if (isCollapsed) {
      const block = getBlockForIndex(editorState.value, start)
      const blockKey = block.block?.blockKey
      const blockEnd = end - block.blockOffset
      const blockTextChars = blockKey ? getBlockText(editorState.value, blockKey) || [] : []
      const blockText = blockTextChars.map(ch => ch.char).slice(0, blockEnd).join('')
      const searchText = blockText.match(/@([^\s\t\n]*)$/i)

      if (searchText !== null) {
        setFilter(searchText[1])
      } else {
        setFilter(null)
      }
    } else {
      setFilter(null)
    }
  }, [isCollapsed, editorState, end, start])
// console.log(getBlock)

  return (
    <div>
      <Editor
        htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
        onChange={setEditorState}
        renderTextFragment={({ children, ...htmlAttrs }) => {
          return <span {...htmlAttrs}>{children}</span>
        }}
        editorState={editorState}
      />
      <Popover
        isOpen={isOpen}
        placementStrategy={placeRightBelow}
      >
        <MentionsPopover>
          {matchingMentions.map(mention => (<li onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); insertMention(mention) }} key={mention}>{mention}</li>))}
        </MentionsPopover>
      </Popover>
    </div>
  );
}

export default App;
