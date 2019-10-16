import getUTF16Length from '../getUTF16Length'

describe('getUTF16Length', () => {
  it('gets the 16 bit length of a string', () => {
    const text = '😅'
    expect(getUTF16Length(text)).toBe(1)
  });
})