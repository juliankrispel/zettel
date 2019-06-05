# Zettel

Super awesome rich text framework for React.js

1. Small file size, 0 dependencies - over 10x smaller than competing frameworks
2. Small API surface area
3. Suitable for building complex document editing experiences




It was [Minimal API surface area](https://www.youtube.com/watch?v=4anAwXYqLG8)



So. Let's take a crack again at text editors on the web. I've been playing with this idea. What if instead of manipulating a tree, we always just edit text:

## Raw Model:

```
[Hello[World]]
```

- `[` marks the beginning of a block
- `]` marks the end of a block


```tsx
type Raw = {
  text:
`[Hello there how are we today]
["Pretty good thank you"
  [What about yourself]
  [Well - also pretty good thanks]
  [This is another
    [Really Cool
      [Component]
    ]
  ]
]`,
  ranges: [{
    offset: 0,
    length: 1,
    key: 'e1'
  }]
  meta: {
    'e1': {
      type: 'whatever',
    }
  }
}
```

## Editor State

## Usage:

### Rendering Nodes

```tsx
<Editor
  renderNode={(props) => {
    return <div>
      <Text {...props}>
      <EditorNode
        {...props}
      />
    </div>
  }}
/>
```

### Rendering Fragments:

```tsx
<Editor
  renderStyle={(props) => {
  }}
  renderEntity={(props) => {
  }}
/>
```

### Affecting Change

- the selection is simplified, only start and end offset matter

```tsx
// Replace range with new block
EditorState.change({
  start: 3,
  end: 19,
  value: [
    { type: 'block-start', data: { type: 'h1', } },
    'New Block',
    { type: 'block-end' }
  ]
})

// Wrap selection in block (creates child block)
EditorState.change({
  value: [
    { type: 'block-start', data: { type: 'li', } },
    Editor.getValue(3, 5),
    { type: 'block-end' }
  ]
})

// Split block and insert new block
EditorState.change({
  value: [
    { type: 'block-end' },
    { type: 'block-start', data: { type: 'quote', } },
    ...values('New Block yo'),
    { type: 'block-end' },
    { type: 'block-start' },
  ]
})

// Insert table
EditorState.change({
  value: [
    { type: 'block-start', data: { type: 'table', } },
    ...values(`[[A1][B1]][[A2][B2]]`),
    { type: 'block-end' },
  ]
})

// Replacing text
EditorState.change({
  start: 3,
  end: 19,
  text: 'I am free'
})

// Splitting Block
EditorState.splitBlock({
  start: 19,
  end: 19,
})

// Wrapping Block
EditorState.wrapBlock({
  start: 0,
  end: 29,
})

// Changing Block
EditorState.change({
  start: 8,
  end: 8,
  block: {
    type: 'H1',
    someData: 'boing',
  }
})

// Compose changes
EditorState.change([{
  start: 3,
  end: 9,
  text: 'Hello',
}, {
  block: {
    type: 'quote'
  }
}])
```
