import { ListState, Change, Value } from '../types' 
import { updateExpression } from '@babel/types';

/**
 * Represents the input and output for updates
 */
export type Update = {
  current: ListState,
  change: Change
}

const countOpen = (value: Value): number => value.filter(val => val.type === 'block-start').length
const countClosed = (value: Value): number => value.filter(val => val.type === 'block-start').length

const countOpenAndClosed = (value: Value) => {
  const open = 0
  const closed = 0
  /*
  value.reduce((acc, val) => {

  }, {})
  */
  return value
}
/**
 * Consolidates a value
 * - inserts missing opening/closing brackets,
 * @param value C
 */
const consolidate = (
  value: Value,
  before: Value,
  after: Value,
  start: number,
  end: number,
): Value => {
  let newValue = value

  const beforeOpen = countOpen(before)
  const beforeClosed = countClosed(before)
  const afterOpen = countOpen(after)
  const afterClosed = countClosed(after)

  /**
   * Consolidation
   * 
   * Cases:
   * - Check if opening and closing block characters cancel
   * each other out
   * - If there were more opening brackets than now,
   * remove matching closing brackets
   * - If there were less opening brackets than now,
   * add closing brackets at the end of current block
  */

  if (beforeOpen > afterOpen) {
    // remove matching closing brackets
  }
  


  return newValue
}
