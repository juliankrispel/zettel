import { Value, Character } from "../types";

export default function getIndexBefore(
  value: Value,
  startIndex: number,
  find: (ch: Character, index: number) => boolean
): number | null {
  for (let i = startIndex - 1; i >= -1; i--) {
    if (find(value[i], i)) {
      return i
    }
  }

  return null
}