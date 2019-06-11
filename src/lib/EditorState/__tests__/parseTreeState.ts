import parseTreeState from '../../flatToTree'
import { ListState } from '../../types'
import raw from '../../rawToFlat'

jest.mock('../id', () => {
  var i = 0
  return () => `key-${i++}`
})

import id from '../id'

describe('parseTreeState', () => {
  test('parses simple flat structure', () => {
    
    const flatState = raw({
      text: '[Hello]',
      entityMap: {},
      ranges: []
    })

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })

  test('parses nested structure', () => {
    const flatState: ListState = raw({
      text: '[1[2[3][4]]]',
      entityMap: {},
      ranges: []
    })

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })

  test('parses invalid structure', () => {
    const flatState: ListState = raw({
      text: '[H[llo]',
      entityMap: {},
      ranges: []
    })

    expect(parseTreeState(flatState)).toMatchSnapshot()
  })
})