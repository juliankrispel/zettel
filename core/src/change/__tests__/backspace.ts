import { EditorState, ListState, valueFromText, backspace, toText } from '../../'

describe('pressing backspace', () => {
  describe('when the cursor is in plain text', () => {
    const editorState = new EditorState({ list: { value: valueFromText('[One]') } })
    const newEditorState = backspace(editorState, 2, 2)

    it('deletes the previous character', () => {
      expect(toText(newEditorState)).toEqual('Oe')
    })

    it('sets the cursor back by one', () => {
      expect(newEditorState.start).toBe(1)
      expect(newEditorState.end).toBe(1)
    })
  })

  describe('when the cursor is behind the first character', () => {
    const editorState = new EditorState({ list: { value: valueFromText('[One]') } })
    const newEditorState = backspace(editorState, 1, 1)

    it('deletes the first character', () => {
      expect(toText(newEditorState)).toEqual('ne')
    })

    it('sets the cursor back by one', () => {
      expect(newEditorState.start).toBe(0)
      expect(newEditorState.end).toBe(0)
    })
  })

  describe('when the cursor is at the beginning of the content [|--', () => {
    const editorState = new EditorState({ list: { value: valueFromText('[One]') } })
    const newEditorState = backspace(editorState, 0, 0)

    it('does not throw', () => {
      expect(() => backspace(editorState, 0, 0)).not.toThrow()
    })

    it('does not change the content', () => {
      expect(toText(newEditorState)).toEqual('One')
    })

    it('does not change the cursor position', () => {
      expect(newEditorState.start).toBe(0)
      expect(newEditorState.end).toBe(0)
    })
  })

  describe('when the cursor is behind a block boundary --][|--', () => {
    const editorState = new EditorState({ list: { value: valueFromText('[One][Two]') } })
    const newEditorState = backspace(editorState, 5, 5)

    it('joins the two blocks', () => {
      expect(toText(newEditorState)).toEqual('OneTwo')
    })

    it('moves the cursor to the correct position', () => {
      expect(newEditorState.start).toBe(3)
      expect(newEditorState.end).toBe(3)
    })
  })

//  describe('when the cursor deletes the last character ', () => {
//  })
})