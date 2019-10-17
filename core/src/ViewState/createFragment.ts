import getIndexBefore from '../query/getIndexBefore'
import getIndexAfter from '../query/getIndexAfter'
import createTree from './createViewState'
import { ListState, ViewState, Block } from '../types'

export default function getUpdateFragment(
  list: ListState,
  _start: number,
  _end: number
): ViewState {
  const blocks: Block[] = []
  let start = getIndexBefore(
    list.value,
    _start,
    ch => ch.type === 'block-start'
  )

  let end = getIndexAfter(
    list.value,
    _end,
    ch => ch.type === 'block-end'
  )

  if (typeof start !== 'number') {
    start = _start
  }

  if (typeof end !== 'number') {
    end = _end
  }

  return createTree({
    value: list.value.slice(start, end),
    entityMap: list.entityMap
  })
}
