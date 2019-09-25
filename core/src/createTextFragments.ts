import { TextCharacter, TextFragment, Value, EntityMap } from './types'
import { CharacterData, CharacterRange } from './types'

type CharacterMeta = CharacterData | CharacterRange

function hasEqualCharacterData (
  left: CharacterMeta = { styles: [] },
  right: CharacterMeta = { styles: [] }
): boolean {
  return left != null && right != null && right.entity === left.entity &&
  Array.from(left.styles || []).sort().join('') === Array.from(right.styles || []).sort().join('')
}

export default function createTextFragments(value: TextCharacter[], entityMap: EntityMap = {}): TextFragment[] {
  const start: TextFragment[] = []
  return value.reduce(
    (acc: any, data, index) => {
      if (acc.length < 1) {
        return [{
          styles: data.styles,
          entity: data.entity,
          offset: index,
          text: value[index].char
        }]
      } else {
        const lastFragment = acc[acc.length - 1]
        if (hasEqualCharacterData(lastFragment, data)) {
          return acc.slice(0, -1).concat([{
            ...lastFragment,
            text: lastFragment.text + value[index].char
          }])
        } else {
          return [
            ...acc,
            {
              styles: data.styles,
              entity: data.entity,
              offset: index,
              text: value[index].char
            }
          ]
        }
      }
    },
    start
  ).map((fragment: TextFragment) => ({
    ...fragment,
    entity: fragment.entity != null ? entityMap[fragment.entity] : null
  }))
}
