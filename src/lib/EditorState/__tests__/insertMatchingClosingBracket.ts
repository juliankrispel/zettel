jest.mock('../id', () => {
  var i = 0
  return () => `key-0`
})

import insertsClosingBrackets from '../insertMatchingClosingBracket'
import raw from '../rawToFlat'

test('[Hey [there][World] > [Hey [there]][World]', () => {
  const value = raw({
    text: '[Hey [there][World]',
    ranges: [],
    entityMap: {},
  }).value

  const expected = raw({
    text: '[Hey [there]][World]',
    ranges: [],
    entityMap: {},
  })

  expect(insertsClosingBrackets(value, 6)).toEqual(expected.value)
})

test('[1[2[3]][4] > [1[2[3]]][4]', () => {
  const value = raw({
    text: '[1[2[3]][4]',
    ranges: [],
    entityMap: {},
  }).value

  const expected = raw({
    text: '[1[2[3]]][4]',
    ranges: [],
    entityMap: {},
  })

  expect(insertsClosingBrackets(value, 3)).toEqual(expected.value)
})