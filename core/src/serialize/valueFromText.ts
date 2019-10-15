import { Value } from '../types'
import raw from './fromRaw'

const valueFromText = (text: string): Value => {
  return raw({
    text: `[${text.replace(/\n/gi, '][')}]`,
    ranges: [],
    entityMap: {}
  }).value.slice(1, -1)
}

export default valueFromText