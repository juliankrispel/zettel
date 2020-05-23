import { ListState } from '../types'
import raw from './fromRaw'

const textToFlat = (text: string): ListState => {
  return raw({
    text: `[${text.replace(/\n/gi, '][')}]`,
    ranges: [],
  })

}

export default textToFlat