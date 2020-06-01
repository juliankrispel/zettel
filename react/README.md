## @zettel/react

The react module for Zettel, the editor framework


### Usage

#### Preventing rerender and flashing

Don't define render prop components inline.

```jsx
function MyComponent() {
  <Editor
    renderTextFragment={() => {
      return <div>{...}</div>
    }}
  />
}
```

or like this 👎:

```jsx
function MyComponent() {
  const RenderTextFraggment = () => {
    return <div>{...}</div>
  }

  return <Editor
    renderTextFragment={() => {...}}
  />
}
```

do this instead 👍:

```jsx
const RenderTextFraggment = () => {
  return <div>{...}</div>
}

function MyComponent() {
  return <Editor
    renderTextFragment={() => {...}}
  />
}
```

If you really have to, [use React.memo](https://reactjs.org/docs/react-api.html#reactmemo).

