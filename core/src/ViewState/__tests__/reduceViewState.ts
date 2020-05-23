import { Value } from '../../types'
import id from '../../EditorState/id'
import reduceViewState from '../reduceViewState'

describe('reduceViewState', () => {
  it('maintains block entities', () => {
    const testState: Value = [{
      blockKey: 'block-1',
      type: 'block-start',
      styles: [],
    }, {
      char: '1'
    }, {
      type: 'block-end',
    }, {
      blockKey: 'block-2',
      type: 'block-start',
      styles: [],
    }, {
      char: '2'
    }, {
      type: 'block-end',
    }]

    const res = reduceViewState({
      value: testState
    })

    expect(res).toMatchSnapshot()
  })

  it('creates view state with fragments in between block boundaries', () => {
    const testState: Value = [{
      blockKey: 'block-1',
      type: 'block-start',
      styles: []
    }, {
      char: 'H'
    }, {
      char: 'i'
    }, {
      type: 'fragment-start'
    }, {
      char: 'Y'
    }, {
      char: 'o'
    }, {
      type: 'block-end',
    }, {
      blockKey: 'block-2',
      type: 'block-start',
      styles: []
    }, {
      char: 'W'
    }, {
      char: 'h'
    }, {
      type: 'fragment-end'
    }, {
      char: 'o'
    }, {
      type: 'block-end',
    }]

    const res = reduceViewState({
      value: testState,
    })

    expect(res).toMatchSnapshot()
  })

  it('creates view state for empty block in between', () => {
    const testState: Value = [{
      blockKey: 'block-1',
      type: 'block-start',
    }, {
      char: 'O'
    }, {
      char: 'n'
    }, {
      char: 'e'
    }, {
      type: 'block-end',
    }, {
      type: 'block-start',
      blockKey: 'block-2',
    },
    {
      type: 'block-end',
    },
    {
      type: 'block-start',
      blockKey: 'block-3',
      styles: []
    }, {
      char: 'T'
    }, {
      char: 'w'
    }, {
      char: 'o'
    }, {
      type: 'block-end',
    }]

    const res = reduceViewState({
      value: testState,
    })

    expect(res).toMatchSnapshot()
  })

  it('creates view state for nested blocks', () => {
    const testState: Value = [{
      blockKey: 'block-1',
      type: 'block-start',
    }, {
      char: 'O'
    }, {
      char: 'n'
    }, {
      char: 'e'
    }, {
      type: 'block-start',
      blockKey: 'block-2',
    }, {
      char: 'T'
    }, {
      char: 'w'
    }, {
      char: 'o'
    }, {
      type: 'block-end',
    }, {
      type: 'block-start',
      blockKey: 'block-3',
      styles: []
    }, {
      char: 'T'
    }, {
      char: 'h'
    }, {
      char: 'r'
    }, {
      char: 'e'
    }, {
      char: 'e'
    }, {
      type: 'block-end',
    }, {
      type: 'block-end',
    }, {
      type: 'block-start',
      blockKey: 'block-4',
      styles: []
    }, {
      char: 'F'
    }, {
      char: 'o'
    }, {
      char: 'u'
    }, {
      char: 'r'
    }, {
      type: 'block-end',
    }, 
  ]

    const res = reduceViewState({
      value: testState,
    })

    expect(res).toMatchSnapshot()
  })

  it('creates view state with nested fragments', () => {
    const testState: Value = [{
      blockKey: 'block-1',
      type: 'block-start',
    }, {
      char: 'O'
    }, {
      type: 'fragment-start'
    }, {
      char: 'n'
    }, {
      type: 'fragment-start',
      data: { some: 'a' }
    }, {
      char: 'e'
    }, {
      char: ' '
    }, {
      type: 'fragment-end'
    }, {
      char: 'T'
    }, {
      char: 'W'
    }, {
      char: 'o'
    }, {
      type: 'fragment-end'
    }, {
      type: 'block-end',
    }  ]

    const res = reduceViewState({
      value: testState,
    })

    // console.log(JSON.stringify(res, null, 2))
    expect(res).toMatchSnapshot()
  })
})