import {
  TextCharacter,
  Text,
  CharacterData,
  CharacterRange
} from '../types'

type CharacterMeta = CharacterData | CharacterRange

function hasEqualCharacterData (
  left: CharacterMeta = { styles: [] },
  right: CharacterMeta = { styles: [] }
): boolean {
  return left != null && right != null &&
  Array.from(left.styles || []).sort().join('') === Array.from(right.styles || []).sort().join('')
}

export default function createTextFragments(value: TextCharacter[]): Text[] {
  const start: Text[] = []
  return value.reduce(
    (acc: any, data, index) => {
      if (acc.length < 1) {
        const el: Text= {
          text: value[index].char,
          data
        }
        if (data.styles) el.styles = data.styles

        return [el]
      } else {
        const lastFragment = acc[acc.length - 1]
        if (hasEqualCharacterData(lastFragment, data)) {
          return acc.slice(0, -1).concat([{
            ...lastFragment,
            text: lastFragment.text + value[index].char
          }])
        } else {
          const el: Text = {
            text: value[index].char,
            data
          }
          if (data.styles) el.styles = data.styles

          return [
            ...acc,
            el
          ]
        }
      }
    },
    start
  )
}
