import { ListState, Change, Value } from '../types' 
import { updateExpression } from '@babel/types';

/**
 * Represents the input and output for updates
 */
export type Update = {
  current: ListState,
  change: Change
}

/**
 * 
 * takes State and Change object, return a state
 * object that has been updated with the Change, and
 * a Change object to undo the change
 */
export default function change(update: Update): Update {
  const currentValue = update.current.value

  const [start, end] = [
    update.change.start,
    update.change.end,
  ].sort((a, b) => a - b)

  const selectedValue = update.current.value.slice(start, end)
  const valueUpdate = update.change.value

  const newValue = currentValue.slice(0, start)
  .concat(valueUpdate)
  .concat(currentValue.slice(end))

  if (newValue[0].type !== 'block-start') {
    throw new Error('First character always needs to be block-start')
  } else if (newValue[newValue.length - 1].type !== 'block-end') {
    throw new Error('Last character always needs to be block-end')
  }

  const newChange: Change = {
    start,
    end: end - selectedValue.length + valueUpdate.length,
    value: selectedValue
  }

  return {
    current: {
      value: newValue,
      entityMap: {}
    },
    change: newChange,
  }
}