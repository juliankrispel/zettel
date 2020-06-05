import { Value, Change } from '../types' 

/**
 * Represents the input and output for updates
 */
export type Update = {
  value: Value,
  change: Change
}

/**
 * 
 * takes State and Change object, return a state
 * object that has been updated with the Change, and
 * a Change object to undo the change
 */
export default function change(update: Update): Update {
  const { value: currentValue } = update

  const [start, end] = [
    update.change.start,
    update.change.end,
  ].sort((a, b) => a - b)

  const selectedValue = update.value.slice(start + 1, end + 1)
  let valueUpdate = update.change.value
  let newValue = update.value

  newValue = currentValue.slice(0, start + 1)
  .concat(valueUpdate)
  .concat(currentValue.slice(end + 1))


  const firstChar = newValue[0]
  const lastChar = newValue[newValue.length - 1]

  if ('type' in firstChar && firstChar.type !== 'block-start') {
    throw new Error('First character always needs to be block-start')
  } else if ('type' in lastChar && lastChar.type !== 'block-end') {
    throw new Error('Last character always needs to be block-end')
  }

  const reverse: Change = {
    start: start + 1,
    end: end - selectedValue.length + valueUpdate.length + 1,
    value: selectedValue
  }

  return {
    value: newValue,
    change: reverse,
  }
}