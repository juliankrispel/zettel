import { Value, Character } from "./types";

export default function findAfter(
  value: Value,
  startIndex: number,
  find: (ch: Character) => boolean
): Character | void {
  for (let i = startIndex; i < value.length; i++) {
    if (find(value[i])) {
      return value[i]
    }
  }
}