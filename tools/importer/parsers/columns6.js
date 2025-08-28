/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be exactly one column, as per the example
  const headerRow = ['Columns (columns6)'];
  // Content row: each immediate child of the element is a column
  const contentRow = Array.from(element.children);
  // Compose rows: header (1 column), then content (N columns)
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
