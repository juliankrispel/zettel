import { Value, Character } from "../types";

export default function getIndexBefore(
  value: Value,
  startIndex: number,
  find: (ch: Character) => boolean
): number | null {
  for (let i = startIndex - 1; i >= -1; i--) {
    if (find(value[i])) {
      return i
    }
  }

  return null
}