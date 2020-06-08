import { Block, TextOrFragment } from '../types'

export default function getFragmentByPath (block: Block, path: number[]): TextOrFragment {
  return path.reduce((acc: any, val) => {
    return (acc.fragments || [])[val]
  }, block)
}
