/**
 * Container for Entities
 */
export type EntityMap = {
  [key: string]: Entity
}

/**
 * Entity ftw!
 */
export type Entity = {
  isAtomic?: boolean,
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
 * Array of Characters
*/
export type Value = Character[]

export type Character = (TextCharacter | BlockStart | BlockEnd)

/**
 * [
 *  { char: 'A', styles: ['bold', 'italic'] },
 *  { type: 'block-start' },
 *  { char: 'B', styles: ['bold', 'italic'] },
 *  { type: 'block-start' },
 *  { char: 'C', styles: ['bold', 'italic'] },
 *  { type: 'block-end' },
 *  { type: 'block-end' },
 * ]
 */

export type CharacterData = {
  styles: string[],
  entity?: string | null,
}

/*
* Represents one text character.
* Contains text symbol as well as array of
* styles and entity
*/
export type TextCharacter = CharacterData & {
  char: string,
  type?: void
}

export type SelectionState = {
  start: number,
  end: number,
  anchorOffset: number,
  focusOffset: number
}

/**
 * Represents the beginning of a block
 */
export type BlockStart = CharacterData & {
  blockKey: string,
  type: 'block-start'
}

export type TextFragment = CharacterData & {
  text: string,
  entity?: Entity
}

/**
 * Represents the end of a block, there
 * has toe be a matching 
 */
export type BlockEnd = {
  type: 'block-end',
  entity?: void
}

/**
 * Embodies all possible changes made to doc
 */
export type Change = {
  start: number,
  end: number,
  value: Value
}

export type EditorChange = {
  start?: number,
  end?: number,
  value?: Value,
  isBoundary?: boolean,
  type?: string
}

/**
 * History
 */
export type Changes = Change[]

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

export type CharacterRange = RawRange

export type Path = number[]

/**
* Tree representation of content. Used for
* rendering only
*/
export type BlockTree = {
  blocks: Block[],
  entityMap: EntityMap,
  blockMap: {
    [blockKey: string]: Path
  }
}

/**
* Represents one node in a tree
* Used for rendering
*/
export type Block = {
  fragments: TextFragment[],
  value: TextCharacter[],
  blockKey: string,
  blocks: Block[],
  styles: string[],
  entity?: Entity | null
}