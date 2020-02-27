import * as React from 'react';
import { Fragment, useState } from 'react'
import styled from 'styled-components'

type Props = {
  styles: Object,
  onChange: (styles: Object) => void,
  onSelectStyle: (style: string) => void
}

const Toggle = styled.div`
background: none;
outline: none;
cursor: pointer;
position: absolute;
left: 0;
top: calc(50% - 10px);
white-space: pre;
`

const Aside = styled.aside`
  position: relative;
  padding: .8em;
  height: 100%;
  border-left: 1px solid #ccc;

  input, select, textarea, button {
    width: 100%;
    margin-bottom: 1em;
    font-size: 0.8em;
    border-radius: 3px;
    outline: none;
  }

  input {
    padding: .3em;
    border: 1px solid #ccc;
  }

  textarea {
    min-height: 150px;
  }

  label {
    display: flex;
    width: 100%;
  }

  select {
    margin-right: 1em;
  }

  button {
    width: auto;
    background: #000;
    padding: .3em .5em;
    border: none;
    color: #fff;
  }
`

const Inside = styled.div`
  min-width: 400px;
`

export default ({
  styles,
  onSelectStyle,
  onChange
}: Props) => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState('')
  const styleKeys = Object.keys(styles)
  const onKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      const name = event.target.value
      onChange({
        ...styles,
        [name]: ''
      })
      setSelectedStyle(name)
    }
  }

  const onStyleChange = (event: any) => {
    onChange({
      ...styles,
      [selectedStyle]: event.target.value
    })
  }

  const style = styles[selectedStyle]

  const onAssign = (event: any) => {
    event.preventDefault()
    onSelectStyle(selectedStyle)
  }

  const onRemove = () => {
    const newStyles = {
      ...styles
    }
    delete newStyles[selectedStyle]
    onChange(newStyles)
    setSelectedStyle('')
  }

  return <Aside>
    {isOpen && <Inside>
      <label>
        <select value={selectedStyle} onChange={(event) => setSelectedStyle(event.target.value)}>
          <option value={""}>None</option>
          {styleKeys.map(key => <option key={key} >{key}</option>)}
        </select>
        <button onMouseDown={onAssign}>Assign</button>
      </label>
      {style != null
        ? <div>
            <textarea value={style} onChange={onStyleChange} />
            <button onMouseDown={onRemove}>Remove</button>
          </div>
        : <div>
            <input onKeyUp={onKeyUp} type="text" placeholder="Add new style, press Enter" />
        </div>
      }
    </Inside>}
    <Toggle onClick={() => setIsOpen(!isOpen)}>{isOpen ? '  〉': '〈' }</Toggle>
  </Aside>
}