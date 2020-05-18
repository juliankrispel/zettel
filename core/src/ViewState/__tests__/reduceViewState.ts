import { Value } from '../../types'
import id from '../../EditorState/id'
import reduceViewState from '../reduceViewState'

const testState: Value = [{
  blockKey: id(),
  type: 'block-start',
  styles: []
}, {
  type: null,
  char: 'H'
}, {
  type: null,
  char: 'i'
}, {
  type: 'fragment-start'
}, {
  type: null,
  char: 'Y'
}, {
  type: null,
  char: 'o'
}, {
  type: 'block-end',
}, {
  blockKey: id(),
  type: 'block-start',
  styles: []
}, {
  type: null,
  char: 'W'
}, {
  type: null,
  char: 'h'
}, {
  type: 'fragment-end'
}, {
  type: null,
  char: 'o'
}, {
  type: 'block-end',
}]


describe('reduceViewState', () => {
  it('should create view state with nested fragments', () => {
    const res = reduceViewState({
      value: testState,
      entityMap: {}
    })
    console.log(JSON.stringify(res, null, 2))
  })
})