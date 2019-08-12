import { ListState } from "./types";

export default function getBlockOffset(list: ListState, key: string): number | null {
  for (let i = 0; i < list.value.length; i++) {
    const val = list.value[i]
    if (val.type === 'block-start' && val.blockKey === key) {
      return i
    }
  }

  return null
}