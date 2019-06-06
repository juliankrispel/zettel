import parseTreeState from '../flatToTree'
import { ListState } from '../../types'

jest.mock('../id', () => {
  var i = 0
  return () => `key-${i++}`
})

describe('parseTreeState', () => {
  test('parses simple flat structure', () => {
    const flatState: ListState = {
      value: [
        { type: 'block-start' },
        { char: 'H', styles: [] },
        { char: 'e', styles: [] },
        { char: 'l', styles: [] },
        { char: 'l', styles: [] },
        { char: 'o', styles: [] },
        { type: 'block-end' },
      ],
      entityMap: {}
    }

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })

  test('parses nested structure', () => {
    const flatState: ListState = {
      value: [
        { type: 'block-start' },
        { char: '1', styles: [] },
        { type: 'block-start' },
        { char: '2', styles: [] },
        { type: 'block-start' },
        { char: '3', styles: [] },
        { type: 'block-end' },
        { type: 'block-start' },
        { char: '4', styles: [] },
        { type: 'block-end' },
        { type: 'block-end' },
        { type: 'block-end' },
      ],
      entityMap: {}
    }

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })

  test('parses invalid structure', () => {
    const flatState: ListState = {
      value: [
        { type: 'block-start' },
        { char: 'H', styles: [] },
        { type: 'block-start' },
        { char: 'l', styles: [] },
        { char: 'l', styles: [] },
        { char: 'o', styles: [] },
        { type: 'block-end' },
      ],
      entityMap: {}
    }

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })
})