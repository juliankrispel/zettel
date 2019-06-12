import { Value } from './types'
import raw from './rawToFlat'

const valueFromText = (text: string): Value => {
  return raw({
    text: `[${text.replace('\n', '][')}]`,
    ranges: [],
    entityMap: {}
  }).value.slice(1, -1)
}

export default valueFromText