import { Value } from '../types'
import raw from './fromRaw'

const textToFlat = (text: string): Value => {
  return raw({
    text: `[${text.replace(/\n/gi, '][')}]`,
    ranges: [],
  })
}

export default textToFlat