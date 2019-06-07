import { ListState, Change, Value } from '../types' 
import { updateExpression } from '@babel/types';

/**
 * Represents the input and output for updates
 */
export type Update = {
  current: ListState,
  change: Change
}

// Get charater index (skips block symbols)
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
 * check if there are an equal amount of block-start
 * and block-end characters in a value
 */
const hasEqualBlockChars = (value: Value): boolean => {
  const blockStartCount = value.filter(val => val.type === 'block-start').length
  const blockEndCount = value.filter(val => val.type === 'block-end').length
  return blockStartCount === blockEndCount 
}

/**
 * takes State and Change object, return a state
 * object that has been updated with the Change, and
 * a Change object to undo the change
 */
export default function change(update: Update): Update {
  const currentValue = update.current.value
  const [start, end] = [
    update.change.start,
    update.change.end,
  ].sort()

  const selectedValue = update.current.value.slice(start, end)
  
  if (!hasEqualBlockChars(selectedValue)) {
    throw new Error(`selected value doesn't have equal
    amount of block-start and block-end characters`)
  } else if(!hasEqualBlockChars(update.change.value)) {
    throw new Error(`inserted value doesn't have equal
    amount of block-start and block-end characters`)
  }

  const newValue = currentValue.slice(0, start)
  .concat(update.change.value)
  .concat(currentValue.slice(end))

  if (newValue[0].type !== 'block-start') {
    throw new Error('First character always needs to be block-start')
  } else if (newValue[newValue.length - 1].type !== 'block-end') {
    throw new Error('Last character always needs to be block-end')
  }

  const newChange: Change = {
    start,
    end: end - selectedValue.length + update.change.value.length,
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