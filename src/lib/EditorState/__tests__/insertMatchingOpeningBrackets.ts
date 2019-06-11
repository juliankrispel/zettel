jest.mock('../id', () => {
  var i = 0
  return () => `key-0`
})

import insertOpeningBracket from '../insertMatchingOpeningBracket'
import raw from '../rawToFlat'

test.skip('[Hey] there][World] > [[Hey] there]][World]', () => {
  const value = raw({
    text: '[Hey] there][World]',
    ranges: [],
    entityMap: {},
  }).value

  const expected = raw({
    text: '[[Hey] there][World]',
    ranges: [],
    entityMap: {},
  })

  expect(insertOpeningBracket(value, 2)).toEqual(expected.value)
})

test('[1][2]][3] > [[1][2]][3]', () => {
  const value = raw({
    text: '[1][2]][3]',
    ranges: [],
    entityMap: {},
  }).value

  const expected = raw({
    text: '[[1][2]][3]',
    ranges: [],
    entityMap: {},
  })

  expect(insertOpeningBracket(value, 5)).toEqual(expected.value)
})


test('[1][[2][3]][4] > [1][[[2][3]][4]', () => {
  const value = raw({
    text: '[1][[2][3]][4]',
    ranges: [],
    entityMap: {},
  }).value

  const expected = raw({
    text: '[1][[[2][3]][4]',
    ranges: [],
    entityMap: {},
  })

  expect(insertOpeningBracket(value, 9)).toEqual(expected.value)
})