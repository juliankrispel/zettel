import { ListState, Change } from '../types' 

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
  const { value: currentValue, entityMap } = update.current

  const [start, end] = [
    update.change.start,
    update.change.end,
  ].sort((a, b) => a - b)

  const selectedValue = update.current.value.slice(start + 1, end + 1)
  let valueUpdate = update.change.value
  let newValue = update.current.value

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
    current: {
      value: newValue,
      entityMap,
    },
    change: reverse,
  }
}