import { Value, TextCharacter } from '../types'
import getBlockOffset from './getBlockOffset'
import getIndexAfter from './getIndexAfter'

/**
 * Get text characters for given block
 */
export default function getBlockValue(value: Value, blockKey: string): TextCharacter[] | null {
  const blockOffset = getBlockOffset(value, blockKey)
  if (blockOffset == null) {
    return null
  }

  const blockEnd = getIndexAfter(
    value,
    blockOffset,
    ch => 'type' in ch && (ch.type === 'block-end' || ch.type === 'block-start')
  )
  // @ts-ignore
  return value.slice(blockOffset + 1, blockEnd)
}