import change, { Update} from '../change'
import raw from '../../rawToFlat'

jest.mock('../id')

import id from '../id'

describe('change' , () => {
  test('replaces text and undo', () => {
    const update: Update = {
      current: raw({
        text: '[Hello]',
        ranges: [],
        entityMap: {}
      }),
      change: {
        start: 1,
        end: 4,
        value: [],
      }
    }

    const changed = change(update)

    expect(changed).toEqual({
      current: raw({
        text: '[lo]',
        ranges: [],
        entityMap: {}
      }),
      change: {
        start: 1,
        end: 1,
        value: raw({
          text: '[Hel]',
          ranges: [],
          entityMap: {}
        }).value.slice(1, 4),
      }
    })

    expect(change(changed)).toEqual(update)
  })

  test.skip(`removing a block-start character automatically
  removes the related closing character`, () => {
    const update: Update = {
      current: raw({
        text: '[1[2[3][4]][5]]',
        ranges: [],
        entityMap: {}
      }),
      change: {
        start: 2,
        end: 3,
        value: [],
      }
    }

    const changed = change(update)

    const expected = raw({
      text: '[12[3][4][5]]',
      ranges: [],
      entityMap: {}
    })

    expect(changed.current).toEqual(expected)
  })

  test.skip(`adding a block-start character automatically adds
  a closing character at the end of the current block`, () => {
    const update: Update = {
      current: raw({
        text: '[Hi Sam]',
        ranges: [],
        entityMap: {}
      }),
      change: {
        start: 3,
        end: 3,
        value: [{
          type: 'block-start',
          blockKey: id()
        }],
      }
    }

    const changed = change(update)

    const expected = raw({
      text: '[Hi [Sam]]',
      ranges: [],
      entityMap: {}
    })

    expect(changed.current).toEqual(expected)
  })
})