import { Value, Character } from "../types";

export default function findBefore(
  value: Value,
  startIndex: number,
  find: (ch: Character) => boolean
): Character | void {
  for (let i = startIndex; i >= 0; i--) {
    if(find(value[i])) {
      return value[i]
    }
  }
}