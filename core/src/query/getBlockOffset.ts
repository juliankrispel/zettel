import { Value } from "../types";

export default function getBlockOffset(value: Value, key: string): number | null {
  for (let i = 0; i < value.length; i++) {
    const val = value[i]
    if ('type' in val && val.type === 'block-start' && val.blockKey === key) {
      return i
    }
  }

  return null
}