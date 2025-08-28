/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example exactly
  const headerRow = ['Table (table13)'];

  // 2. Extract column blocks from the given HTML
  // Each child div represents a column in a single row
  const columns = Array.from(element.children);

  // Edge case: If no columns found, create an empty cell row
  const row = columns.length > 0 ? [columns] : [''];

  // 3. Build table structure: header, row (single row of columns)
  const cells = [headerRow, row];

  // 4. Create the table block with referenced elements (not cloned or new)
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element with the new block
  element.replaceWith(block);
}
