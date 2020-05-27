Ideas for the model (not all implemented yet although we're close.

- No entities
- Data model is json parsable serializable (no fancy objects)
- Data model should as simple as possible

```typescript
const value = ['What is going on']


const value = [
  { type: 'block-start' },
  'Hello world',
  { type: 'block-end' },
  { type: 'block-start' },
  'Hello',
  { type: 'fragment-start' },
  'World',
  { type: 'fragment-end' },
  { type: 'block-end' },
]
```
