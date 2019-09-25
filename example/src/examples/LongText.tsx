import React, { useState, useEffect } from 'react'
import { EditorState } from '@editable/core'
import Editor from '@editable/react'
const { LoremIpsum } = require("lorem-ipsum")

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 2
  },
  wordsPerSentence: {
    max: 10,
    min: 4
  }
});

const text = `[${lorem.generateParagraphs(3000).split('\n').join('][')}]`

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  return (
    <div>
      <Editor
        htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
        onChange={setEditorState}
        editorState={editorState}
      />
    </div>
  );
}

export default App;
