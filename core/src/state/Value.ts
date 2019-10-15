import { throwStatement } from "@babel/types";

const chunkSize = 100

const chunk = <t>(input: t[]): t[][] =>
  input.reduce(
    (acc, val, index) => {
      if (index > chunkSize) {
        acc.push([])
      }
      const _chunk = acc[acc.length - 1]
      _chunk.push(val)
      return acc
    }, [[]]
  )

class Value<t> {
  chunks: t[][]

  constructor(array: t[]) {
    this.chunks = chunk(array)
  }

  map(cb: (val: t, index: number) => t) {
    this.chunks = this.chunks.map(chunk => {
      return chunk.map(cb)
    })

    return this
  }

  replace(start: number, end: number, value: t[]) {
    this.chunks = this.chunks.reduce((acc, chunk) => {
      return acc
    }, this.chunks)
  }
}