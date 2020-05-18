import { ViewState, Block, Fragment, ContainerFragment } from '../types'

export default function getFragmentsByPath (block: Block, path: number[]): Fragment[] {
  if (path.length === 0) {
    return block.fragments
  }

  return path.reduce((acc, val) => {
    const fragment = acc[val] as ContainerFragment
    return fragment.fragments || acc
  }, block.fragments)
}
