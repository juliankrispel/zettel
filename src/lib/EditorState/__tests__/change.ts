import change, { Update} from '../change'
import raw from '../rawToFlat'

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

  test('consolidates uneven block characters', () => {
    const update: Update = {
      current: raw({
        text: '[1[2[3[4]]]]',
        ranges: [],
        entityMap: {}
      }),
      change: {
        start: 1,
        end: 5,
        value: [],
      }
    }

    const changed = change(update)

    /*
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
    */
  })

})