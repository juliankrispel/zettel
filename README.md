# Editable

Framework for building text editors

- Small file size, 0 dependencies - over 10x smaller than competing frameworks
- [Minimal API surface area](https://www.youtube.com/watch?v=4anAwXYqLG8)
- Suitable for building complex document editing experiences
- State can totally be reused with other frameworks

Examples:

```tsx
// Replace range with new block
State.change({
  start: 3,
  end: 19,
  value: [
    { type: 'block-start', data: { type: 'h1', } },
    'New Block',
    { type: 'block-end' }
  ]
})

// Wrap selection in block (creates child block)
State.change({
  value: [
    { type: 'block-start', data: { type: 'li', } },
    Editor.getValue(3, 5),
    { type: 'block-end' }
  ]
})

// Split block and insert new block
State.change({
  value: [
    { type: 'block-end' },
    { type: 'block-start', data: { type: 'quote', } },
    ...values('New Block yo'),
    { type: 'block-end' },
    { type: 'block-start' },
  ]
})

// Insert table
State.change({
  value: [
    { type: 'block-start', data: { type: 'table', } },
    ...values(`[[A1][B1]][[A2][B2]]`),
    { type: 'block-end' },
  ]
})

// Replacing text
State.change({
  start: 3,
  end: 19,
  text: 'I am free'
})

// Splitting Block
State.splitBlock({
  start: 19,
  end: 19,
})

// Wrapping Block
State.wrapBlock({
  start: 0,
  end: 29,
})

// Changing Block
State.change({
  start: 8,
  end: 8,
  block: {
    type: 'H1',
    someData: 'boing',
  }
})

// Compose changes
State.change([{
  start: 3,
  end: 9,
  text: 'Hello',
}, {
  block: {
    type: 'quote'
  }
}])
```

### State.commit()

Push changes to undoStack

```tsx
State
  .change({ value: ...Value.fromText('Hello there') })
  .change({ value: ...Value.fromText('Boing') })
  .commit()
```

### State.undo()

### State.redo()

## Raw Model:

```tsx
type Raw = {
  text:
`[Hello there how are we today]
[Pretty good thank you
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

## `<Editor />` Component

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
  renderFragment={({ children, fragment }) => {
    if (fragment.styles.includes('bold')) {
      return <strong>{props.children}</strong>
    }

    return props.children
  }}
/>
```

### Decorating values

```tsx
<Editor
decorate={()}
/>
```


### Implementing the editor component:

What do we actually need from the view model:

- we need rendering
- we need event handling

Can we abstract this so that almost all logic can be plugged into other frameworks like `vue` or `angular` or `ember`?

Yes we could!

```
(React/Vue/Angular).(onKeyDown|onSelectionChange): Event =>
  (Zettel).handleEvent =>
    (Zettel).command: Change =>
      (Zettel).change: State =>
        (React/Vue/Angular).render
```

### Commands

- backspace
- backspaceOneWord
- backspaceToStart
- delete
- deleteOneWord
- cut
- paste
- copy
- insert character

