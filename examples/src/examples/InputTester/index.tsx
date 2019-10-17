import React, { useRef, useState, useEffect } from 'react'

const text = `[[One][Two]][[Three][Four]]`

const handler = (event: any) => {
  // console.log({ ...event })
  // event.stopPropagation();
  // event.preventDefault();
  event.getTargetRanges != null && console.log(event.type, event.getTargetRanges())
  event.ranges != null && console.log(event.type, event.ranges)
}

const events = ['compositionstart', 'compositionupdate', 'input', 'beforeinput']

const App = () => {
  const [isComposing, set] = useState(false)
  const [state, setState] = useState({})
  const stopComposing = () => set(false)
  const startComposing = () => set(true)
  const ref = useRef(null)
  let data: {[key: string]: any} = { ...state }

  const cb = (event: any, _state: any) => {
    if (data[event.type] == null) {
      data[event.type] = []
    }
    if (event.getTargetRanges != null) {
      const ranges = event.getTargetRanges().map((range: any) => ({
        startOffset: range.startOffset,
        endOffset: range.endOffset,
      }));

      // @ts-ignore
      const { startOffset, endOffset } = window.getSelection().getRangeAt(0)
      data[event.type].push({
        data: event.data,
        inputType: event.inputType,
        type: event.type,
        ranges,
        domRange: { startOffset, endOffset }
      });
    } else if (event.data != null) {
      data[event.type].push({
        inputType: event.inputType,
        data: event.data
      });
    } else if (event.char != null) {
      data[event.type].push({
        key: event.key,
        inputType: event.inputType,
        char: event.char
      });
    } else {
      console.log(event)
      data[event.type].push({
        key: event.key,
        char: event.char,
        type: event.type
      });
    }

    setState({
      ..._state,
      ...data,
      selection: {...getSelection()}
    })
  }

  const recordEvent = (name: string) => {
    // @ts-ignore
    ref.current.addEventListener(name, (event) => cb(event, state))
  }

  useEffect(() => {
    events.forEach(recordEvent)
  }, [ref.current])

  return <React.Fragment>
    <div contentEditable suppressContentEditableWarning
    ref={ref}
  >
    <h1>Try me</h1>
  </div>
  <pre>{JSON.stringify(state, null, 2)}</pre>
  </React.Fragment>
}

export default App;
