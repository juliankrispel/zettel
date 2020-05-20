import {
  TextCharacter,
  TextFragment,
  EntityMap,
  CharacterData,
  CharacterRange
} from '../types'

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
        const el: TextFragment= {
          text: value[index].char
        }
        if (data.styles) el.styles = data.styles
        if (data.entity) el.entity = entityMap[data.entity]

        return [el]
      } else {
        const lastFragment = acc[acc.length - 1]
        if (hasEqualCharacterData(lastFragment, data)) {
          return acc.slice(0, -1).concat([{
            ...lastFragment,
            text: lastFragment.text + value[index].char
          }])
        } else {
          const el: TextFragment = {
            text: value[index].char
          }
          if (data.styles) el.styles = data.styles
          if (data.entity) el.entity = entityMap[data.entity]

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
