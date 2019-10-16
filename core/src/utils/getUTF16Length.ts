export default function getUTF16Length(string: string) {
  let length = 0
  for (let _ of string) {
    length++
  }
  return length
}