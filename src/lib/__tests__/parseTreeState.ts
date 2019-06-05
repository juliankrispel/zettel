import parseTreeState from '../parseTreeState'

jest.mock('../id', () => {
  var i = 0
  return () => `key-${i++}`
})

describe('parseTreeState', () => {
  test('parses simple flat structure', () => {
    const flatState = {
      value: [
        { char: '[', metaKeys: [] },
        { char: 'H', metaKeys: [] },
        { char: 'e', metaKeys: [] },
        { char: 'l', metaKeys: [] },
        { char: 'l', metaKeys: [] },
        { char: 'o', metaKeys: [] },
        { char: ']', metaKeys: [] },
      ],
      meta: {}
    }

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })

  test('parses nested structure', () => {
    const flatState = {
      value: [
        { char: '[', metaKeys: [] },
        { char: '1', metaKeys: [] },
        { char: '[', metaKeys: [] },
        { char: '2', metaKeys: [] },
        { char: '[', metaKeys: [] },
        { char: '3', metaKeys: [] },
        { char: ']', metaKeys: [] },
        { char: '[', metaKeys: [] },
        { char: '4', metaKeys: [] },
        { char: ']', metaKeys: [] },
        { char: ']', metaKeys: [] },
        { char: ']', metaKeys: [] },
      ],
      meta: {}
    }

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })

  test('parses invalid structure', () => {
    const flatState = {
      value: [
        { char: '[', metaKeys: [] },
        { char: 'H', metaKeys: [] },
        { char: '[', metaKeys: [] },
        { char: 'l', metaKeys: [] },
        { char: 'l', metaKeys: [] },
        { char: 'o', metaKeys: [] },
        { char: ']', metaKeys: [] },
      ],
      meta: {}
    }

    console.log(JSON.stringify(parseTreeState(flatState), null, 2))
  })
})