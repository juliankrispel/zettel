import { Value } from '../types'
import raw from './fromRaw'

const valueToText = (val: Value): string => {
  return val
    .map(ch => 'char' in ch ? ch.char : null)
    .filter(ch => ch != null).join('')
}

export default valueToText