import { Value, Character } from "./types";

export default function getIndexBefore(
  value: Value,
  startIndex: number,
  find: (ch: Character) => boolean
): number | void {
  for (let i = startIndex - 1; i >= 0; i--) {
    if (find(value[i])) {
      return i
    }
  }
}