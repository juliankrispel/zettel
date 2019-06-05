/**
 * General Purpose Data container for Blocks and Entities
 */
export type EntityMap = {
  [key: string]: any
}

/**
 * The root state object
 * 
 * @param value: Value
 * @param entityMap: EntityMap
 */
export type ListState = {
  value: Value,
  entityMap: EntityMap,
}
/*

  styles: string[],
  entity?: string,
  */


/**
* Value represents Text and Blocks
*/
export type Value = [TextCharacter | BlockCharacter | BlockEndCharacter]

/*
* Represents one character
*/
export type TextCharacter = {
  char: string,
  styles: string[],
  entity?: string,
}

export type BlockCharacter = {
  type: 'block-start',
  data?: any
}

export type BlockEndCharacter = {
  type: 'block-end'
}

/**
 * Change
 * 
 * - Represents all possible changes made to doc
 */
export type Change = {
  start: number,
  end: number,
  value: Value
}[]

export type RawRange = {
  start: number,
  end: number,
  key: string,
}

export type RawDocument = {
  text: string,
  ranges: RawRange[],
  entityMap: EntityMap,
}

export type Block = {
  text: Text,
  key: string,
  nodes: Block[],
}

export type TreeState = {
  nodes: Block[],
  entityMap: EntityMap,
}

export interface EditorState {
  /**
   * @method change()
   * 
   * `EditorState.change({ start: 9, end: 18, value: [] })`
   */
  change: (change: Change) => EditorState;

  /**
   * @method undo()
   * 
   * `EditorState.undo()`
   */
  undo: () => EditorState;

  /**
   * @method redo()
   * 
   * `EditorState.redo()`
   */
  redo: () => EditorState;

  readonly list: ListState;
  readonly tree: TreeState;
}