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

  const selectedValue = update.current.value.slice(start, end)
  let valueUpdate = update.change.value
  let newValue = update.current.value

  // value can also be character data which is then merged
  // into the existing value
  if (!Array.isArray(valueUpdate)) {
    valueUpdate = currentValue.slice(start + 1, end + 1)
    .map(char => ({
      ...char,
      ...valueUpdate
    }))
    newValue = currentValue.slice(0, start + 1)
    .concat(valueUpdate)
    .concat(currentValue.slice(end + 1))
  } else {
    newValue = currentValue.slice(0, start)
    .concat(valueUpdate)
    .concat(currentValue.slice(end))
  }


  if (newValue[0].type !== 'block-start') {
    throw new Error('First character always needs to be block-start')
  } else if (newValue[newValue.length - 1].type !== 'block-end') {
    throw new Error('Last character always needs to be block-end')
  }

  const newChange: Change = {
    start: start,
    end: end - selectedValue.length + valueUpdate.length,
    value: selectedValue
  }

  return {
    current: {
      value: newValue,
      entityMap,
    },
    change: newChange,
  }
}