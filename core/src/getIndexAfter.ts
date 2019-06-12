import { Value, Character } from "./types";

export default function getIndexAfter(
  value: Value,
  startIndex: number,
  find: (ch: Character) => boolean
): number | void {
  for (let i = startIndex + 1; i < value.length; i++) {
    if (find(value[i])) {
      return i
    }
  }
}