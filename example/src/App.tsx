import React from 'react'

const text = `[Hello World
[This is evil
[Nesting
[Nestnig]]]]`

const initialEditorState = EditorState.fromJSON({
  text,
  ranges: [{
    offset: 3,
    length: 5,
    styles: ['bold']
  }, {
    offset: 7,
    length: 10,
    styles: ['italic']
  }],
  entityMap: {}
})

const App = () => {
  return (
    <div>Hello</div>
  );
}

export default App;
