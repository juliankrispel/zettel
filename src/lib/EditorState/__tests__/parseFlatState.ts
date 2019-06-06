import parseFlat from '../rawToFlat'

describe('parseFlatState', () => {
  test('parses raw doc', () => {
    const raw = {
      text: '[Hello there world]',
      ranges: [],
      entityMap: {}
    }

    expect(parseFlat(raw)).toMatchSnapshot()
  })

  test('parses invalid doc as empty', () => {
    const raw = {
      text: 'Hello there world',
      ranges: [],
      entityMap: {}
    }

    expect(parseFlat(raw)).toEqual({ value: [], entityMap: {} })
  })

  test('skips invalid bits', () => {
    const raw = {
      text: 'Hello [there] world',
      ranges: [],
      entityMap: {}
    }

    expect(parseFlat(raw)).toMatchSnapshot()
  })
  
  test('skips invalid nested text', () => {
    const raw = {
      text: '[1[2[3]hello]]',
      ranges: [],
      entityMap: {}
    }

    expect(parseFlat(raw)).toEqual({
      value: [
        { type: 'block-start' },
        { char: '1', styles: [] },
        { type: 'block-start' },
        { char: '2', styles: [] },
        { type: 'block-start' },
        { char: '3', styles: [] },
        { type: 'block-end' },
        { type: 'block-end' },
        { type: 'block-end' },
      ],
     entityMap: {} })
  })
})