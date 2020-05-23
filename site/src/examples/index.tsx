import ItalicAndBold from  './ItalicAndBold'
import BlockStyling from './BlockStyling'
import PlainText from './PlainText'
import ReadOnly from './ReadOnly'
import Tree from './Tree'
import MarkdownTest from './MarkdownTest'
import Nocode from './Nocode'
import Mentions from './Mentions'
import Changes from './Changes'
import Draggable from './Draggable'
import Fragments from './Fragments'
import TimeTravel from './TimeTravel'

const Examples = {
  'Plain Text': PlainText,
  'Changes': Changes,
  'Mentions': Mentions,
  'ReadOnly': ReadOnly,
  'Nocode': Nocode,
  'Fragments': Fragments,
  'Basic Text styling': ItalicAndBold,
  'Block Styling': BlockStyling,
  'Markdown': MarkdownTest,
  'Recursive Structure': Tree,
  'Draggable Blocks': Draggable,
  'Time Travel': TimeTravel,
}

export default Examples