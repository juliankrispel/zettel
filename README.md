![Zettel](logo_small.png)

## [Zettel](https://zettel.software)

Disclaimer: Project still in early stages - API subject to frequent change, use at your own risk.

### A radically different approach to building text editors in the browser.

[Join Zettel on Slack](https://join.slack.com/t/zetteljs/shared_invite/zt-eiih8wis-Hca9bcrvX3V728odwEqiBA)

[![@zettel/core](https://badge.fury.io/js/%40zettel%2Fcore.svg)](https://badge.fury.io/js/%40zettel%2Fcore)
[![@zettel/react](https://badge.fury.io/js/%40zettel%2Freact.svg)](https://badge.fury.io/js/%40zettel%2Freact)

## Getting started with @zettel/core and @zettel/react

Right now we only have the packages `core` and `react`, you'll need those to get started.

```
yarn add @zettel/core @zettel/react
```

Now that you have them installed, here's a basic example of a plaintext editor:

```jsx
import * as React from 'react';
import { useState } from 'react'
import { EditorState } from '@zettel/core'
import Editor from '@zettel/react'

const text = `[One 😅Line][And another line of text][And another line]`

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
    entityMap: {}
  }))

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      onChange={setEditorState}
      editorState={editorState}
    />
  );
}

export default App;
```

For more examples [have a look here](https://github.com/juliankrispel/zettel/tree/master/site/src/examples)


## Current Roadmap

This changes a lot. To focus as much as possible I'll keep this small.

- [x] Firefox, Safari, Chrome support
- [x] rendering text
- [x] render blocks
- [x] keeping selection in sync
- [x] All editing operations
- [x] render non-text media
- [x] react view layer
- [x] render text fragments
- [x] redo/undo
- [x] UTF-16 support for editing
- [x] IME Event handling
- [x] Android support (via Input Events Level 2) [thanks Trix ❤️](https://github.com/basecamp/trix/blob/master/src/trix/controllers/level_2_input_controller.coffee)
- [x] [IME support](https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide)
- [ ] [rtl support](https://github.com/juliankrispel/zettel/issues/8)
- [ ] Support for parser integration
- [ ] Prototype collaborative editing
- [ ] Start writing docs and publishing exampples on codesandbox
- [ ] Alternative view layers (Vuejs/svelte/angular)


## Thanks

This project wouldn't have come this far without the influence of open source projects such as:

- [draft-js](https://github.com/facebook/draft-js)
- [slatejs](https://github.com/ianstormtaylor/slate)
- [prosemirror](https://github.com/ProseMirror/prosemirror)
- [vscode](https://github.com/Microsoft/vscode/issues)
- [trix](https://github.com/basecamp/trix)
