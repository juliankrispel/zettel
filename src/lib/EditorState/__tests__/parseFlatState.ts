import parseFlat from '../rawToFlat'

describe('parseFlatState', () => {
  test('parses raw doc', () => {
    const raw = {
      text: '[Hello there world]',
      ranges: [],
      meta: {}
    }

    expect(parseFlat(raw)).toMatchSnapshot()
  })

  test('parses invalid doc as empty', () => {
    const raw = {
      text: 'Hello there world',
      ranges: [],
      meta: {}
    }

    expect(parseFlat(raw)).toEqual({ value: [], meta: {} })
  })

  test('skips invalid bits', () => {
    const raw = {
      text: 'Hello [there] world',
      ranges: [],
      meta: {}
    }

    expect(parseFlat(raw)).toMatchSnapshot()
  })
  
  test('skips invalid nested text', () => {
    const raw = {
      text: '[1[2[3]hello]]',
      ranges: [],
      meta: {}
    }

    expect(parseFlat(raw)).toEqual({
      value: [ { char: '[', metaKeys: [] },
        { char: '1', metaKeys: [] },
        { char: '[', metaKeys: [] },
        { char: '2', metaKeys: [] },
        { char: '[', metaKeys: [] },
        { char: '3', metaKeys: [] },
        { char: ']', metaKeys: [] },
        { char: ']', metaKeys: [] },
        { char: ']', metaKeys: [] } ],
     meta: {} })
  })
})