/**
 * Container for Entities
 */
export type EntityMap = {
  [key: string]: any
}

/**
 * State of a document.
 * Used to create derived states such as BlockTree,
 * RawDocument or any other
 */
export type ListState = {
  value: Value,
  entityMap: EntityMap,
}

/**
* Value object. Think of this as your `value` in `<input value={value} />`,
* except instead of a string you get an array of objects.
*/
export type Value = (Character | BlockStart | BlockEnd)[]

/*
* Represents one text character.
* Contains text symbol as well as array of
* styles and entity
*/
export type Character = {
  char: string,
  styles: string[],
  entity?: string | null,
  type?: void,
}

/**
 * Represents the beginning of a block
 */
export type BlockStart = {
  type: 'block-start',
  data?: any
}

/**
 * Represents the end of a block, there
 * has toe be a matching 
 */
export type BlockEnd = {
  type: 'block-end'
}

/**
 * Embodies all possible changes made to doc
 */
export type Change = {
  start: number,
  end: number,
  value: Value
}[]

/**
 * Represents raw form of a Zettel Document,
 * serializable and easier on the human eye
 */
export type RawDocument = {
  text: string,
  ranges: RawRange[],
  entityMap: EntityMap,
}

/**
 * Ranges in RawDocument
 * Used to style text and relate to entities
 */
export type RawRange = {
  offset: number,
  length: number,
  styles: string[],
  entity?: string | null,
}

/**
* Tree representation of content. Used for
* rendering only
*/
export type BlockTree = {
  blocks: Block[],
  entityMap: EntityMap,
}

/**
* Represents one node in a tree
* Used for rendering
*/
export type Block = {
  value: Character[],
  key: string,
  blocks: Block[],
}


/**
 * 
 */
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
  readonly tree: BlockTree;
}