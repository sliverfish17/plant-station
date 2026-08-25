import {
  BLOCKS,
  type Block,
  type Document,
  type Text,
  type TopLevelBlock,
} from '@contentful/rich-text-types'

/**
 * Builders for the rich-text bodies in the seed content.
 *
 * Contentful's rich-text JSON is verbose enough that hand-writing it inline
 * would bury the actual copy from the design file. These produce the real node
 * shape — the same one the CDA returns — so the renderer is exercised properly
 * rather than being handed a simplified stand-in.
 */

function text(value: string): Text {
  return { nodeType: 'text', value, marks: [], data: {} }
}

export function paragraph(value: string): TopLevelBlock {
  return { nodeType: BLOCKS.PARAGRAPH, data: {}, content: [text(value)] }
}

export function heading(value: string): TopLevelBlock {
  return { nodeType: BLOCKS.HEADING_2, data: {}, content: [text(value)] }
}

export function bulletList(items: readonly string[]): TopLevelBlock {
  // A list-item node is a plain Block; `ListItemBlock` in this library names the
  // blocks allowed *inside* a list item, not the item itself.
  const listItems: Block[] = items.map((item) => ({
    nodeType: BLOCKS.LIST_ITEM,
    data: {},
    content: [paragraph(item)],
  }))

  return { nodeType: BLOCKS.UL_LIST, data: {}, content: listItems }
}

export function richText(...blocks: readonly TopLevelBlock[]): Document {
  return { nodeType: BLOCKS.DOCUMENT, data: {}, content: [...blocks] }
}
