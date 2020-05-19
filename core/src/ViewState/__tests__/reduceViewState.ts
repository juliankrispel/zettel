import { Value } from '../../types'
import id from '../../EditorState/id'
import reduceViewState from '../reduceViewState'

describe('reduceViewState', () => {
  it('should create view state with nested fragments', () => {
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
      entityMap: {}
    })

    expect(res).toMatchSnapshot()
  })

  it('empty block in between', () => {
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
      entityMap: {}
    })

    expect(res).toMatchSnapshot()
  })

  it('nested blocks', () => {
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
      entityMap: {}
    })

    expect(res).toMatchSnapshot()
  })
})