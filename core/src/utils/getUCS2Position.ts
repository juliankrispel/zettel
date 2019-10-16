export default function getUCS2Position(text: string, utf16index: number) {
  let utf16length = 0
  let length = 0
  for (let ch of text) {
    utf16length++
    length+= ch.length
    if (utf16index === utf16length) {
      break
    }
  }
  return length
}