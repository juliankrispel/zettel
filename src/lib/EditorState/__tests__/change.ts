import change, { Update} from '../change'
import raw from '../rawToFlat'

describe('change' , () => {
  test('updates text', () => {
    const update: Update = {
      current: raw({
        text: '[Hello]',
        ranges: [],
        entityMap: {}
      }),
      change: {
        start: 0,
        end: 3,
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
        end: 4,
          value: raw({
          text: '[Hel]',
            ranges: [],
            entityMap: {}
          }).value.slice(1, 4),
        }
    })
  })
})