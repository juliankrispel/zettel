export type Dict = {
  [key: string]: any
}

export type FlatState = {
  value: Value,
  entityMap: Dict,
}


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

export type Value = [TextCharacter | BlockCharacter | BlockEndCharacter]


export type Change = {
  start: number,
  end: number,
  value: Value
}

export type RawRange = {
  start: number,
  end: number,
  key: string,
}

export type RawDocument = {
  text: string,
  ranges: RawRange[],
  entityMap: Dict,
}

export type Block = {
  value: Value,
  key: string,
  nodes: Block[],
}

export type TreeState = {
  nodes: Block[],
  entityMap: Dict,
}

export type EditorState = {
  readonly flatState: FlatState,
  readonly treeState: TreeState,
}