import { Value } from '../types'

/**
 * Maps text index to list index
 */
export default function textToListIndex(value: Value, textIndex: number): number {
  let offset = 0

  for (let i = 0; i < value.length; i++) {
    const ch = value[i]
    if (textIndex === offset && 'char' in ch) {
      return i
    } else if ('char' in ch) {
      offset++
    }
  }

  return offset
}