# ViewState

- result of `createTree(ListState)`
- readonly structure for rendering editor

### Example in Text

```txt
[Hi <You]
[What> up]
```

- `<`, `>` - fragment delimiters
- `[`, `]` - block delimiters

### Example as Editor State

```ts
[
  { type: 'block-start' },
  { char: 'H' },
  { char: 'i' },
  { char: ' ' },
  { type: 'fragment-start', data: 'boing' },
  { char: 'Y' },
  { char: 'o' },
  { char: 'u' },
  { type: 'block-end' },
  { type: 'block-start' },
  { char: 'W' },
  { char: 'h' },
  { char: 'a' },
  { char: 't' },
  { type: 'fragment-end' },
  { char: ' ' },
  { char: 'U' },
  { char: 'p' },
  { type: 'block-end' },
]
```

### Example as View State

```ts
[{
  fragments: [{
    text: 'Hi '
  }, {
    fragments: [{
      text: 'You'
    }]
  }]
}, {
  {
    fragments: [{
      text: 'What'
    }]
  },
  fragments: [{
    text: ' up'
  }]
}]
```

### Implementation

```ts
{
  viewState,
  i,
  blockPath,
  fragPath
}

Reducer(Char, State)

Value.reduce(Reducer, State)
```

### Logic

Given a document contains the following tokens:

- `Char`
- `BlockStart`
- `BlockEnd`
- `FragmentStart`
- `FragmentEnd`