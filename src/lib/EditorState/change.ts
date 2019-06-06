import { ListState, Change, Value } from '../types' 
import { updateExpression } from '@babel/types';

/**
 * Represents the input and output for updates
 */
export type Update = {
  current: ListState,
  change: Change
}

const getIndex = (index: number, value: Value): number => {
  let i: number = 0;
  let realIndex: number = 0;

  for (let ch of value) {
    realIndex++
    if (ch.type == null) {
      i++
    }
    if (i >= index) {
      break
    }
  }

  return realIndex
}

/**
 * takes State and Change object, return a state
 * object that has been updated with the Change, and
 * a Change object to undo the change
 */
export default function change(update: Update): Update {
  const currentValue = update.current.value
  const [start, end] = [
    getIndex(update.change.start, currentValue),
    getIndex(update.change.end, currentValue),
  ].sort()


  console.log(start, end)
  // Use selectedValue for validation of change
  const selectedValue = update.current.value.slice(start, end)

  // console.log('yo', currentValue.slice(end))
  const newValue = currentValue.slice(0, start)
  .concat(update.change.value)
  .concat(currentValue.slice(end))

  const newChange: Change = {
    start,
    end: end - update.change.value.length,
    value: selectedValue
  }
  console.log(newChange)

  return {
    current: {
      value: newValue,
      entityMap: {}
    },
    change: newChange,
  }
}