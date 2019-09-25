import { ListState, TextCharacter } from './types'
import getBlockOffset from './getBlockOffset'
import getIndexAfter from './getIndexAfter'

/**
 * Get text characters for given block
 */
export default function getBlockValue(list: ListState, blockKey: string): TextCharacter[] | null {
  const blockOffset = getBlockOffset(list, blockKey)
  if (blockOffset == null) {
    return null
  }

  const blockEnd = getIndexAfter(
    list.value,
    blockOffset,
    ch => ch.type === 'block-end' || ch.type === 'block-start'
  )
  // @ts-ignore
  return list.value.slice(blockOffset + 1, blockEnd - 1)
}