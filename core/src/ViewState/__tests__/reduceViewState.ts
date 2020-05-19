import { Value } from '../../types'
import id from '../../EditorState/id'
import reduceViewState from '../reduceViewState'

const testState: Value = [{
  blockKey: id(),
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
  blockKey: id(),
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


describe('reduceViewState', () => {
  it('should create view state with nested fragments', () => {
    const res = reduceViewState({
      value: testState,
      entityMap: {}
    })

    const expected = {
      "blocks": [
        {
          "fragments": [{
              "entity": null,
              "offset": 0,
              "text": "Hi"
            },
            {
              "entity": null,
              "offset": 0,
              "text": "Yo"
            }
          ],
          "value": [{ "char": "W" }, { "char": "h" }],
        },
        {
          "fragments": [{
              "entity": null,
              "offset": 0,
              "text": "Wh"
            },
            {
              "entity": null,
              "offset": 0,
              "text": "o"
            }
          ],
          "value": [],
          "blocks": [],
          "blockLevel": 0,
          "blockKey": "vrcged",
          "styles": []
        }
    ]
  }
  // expect(res).toContainEqual(expected)
    console.log(JSON.stringify(res, null, 2))
  })
})