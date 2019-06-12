import { ListState } from './types'
import raw from './rawToFlat'

const textToFlat = (text: string): ListState => {
  return raw({
    text: `[${text.replace('\n', '][')}]`,
    ranges: [],
    entityMap: {}
  })

}

export default textToFlat