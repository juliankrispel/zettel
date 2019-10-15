# Event handling

- Input Events -> update(EditorState) -> EditorState

## State Object

```ts
type State = {
  value: Value,
  selection: SelectionState,
  undoStack: Change[],
  redoStack: Change[]
}
```

## Change Object

```ts
type Change = {
  start: number,
  end: number,
  value: Value
}[]
```

## Updates

One method - the change method, two args: `State` and `Change`.

```ts
change(State, Change)

```

## Tree Object

For view model


```ts
type TreeNode = {
  textFragments: TextFragment[],
  nodes: TreeNode[]
}
```