import { ListState } from './types'
import valueFromText from './valueFromText'
import raw from './rawToFlat'

const textToFlat = (text: string): ListState => {
  return raw({
    text: `[${text.replace(/\n/gi, '][')}]`,
    ranges: [],
    entityMap: {}
  })

}

export default textToFlat