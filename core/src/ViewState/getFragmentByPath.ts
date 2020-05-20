import { Block, Fragment } from '../types'

export default function getFragmentByPath (block: Block, path: number[]): Fragment {
  return path.reduce((acc: any, val) => {
    return (acc.fragments || [])[val]
  }, block)
}
