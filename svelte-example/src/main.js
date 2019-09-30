import App from './App.svelte';
import { EditorState } from '@zettel/core'

const text = `[One Line][And another line of text][And another line]`
const initialEditorState = EditorState.fromJSON({
  text,
  ranges: [],
  entityMap: {}
})

var app = new App({
  target: document.body,
  props: {
    editorState: initialEditorState
  }
});

export default app;