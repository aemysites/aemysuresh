/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as a single column matching the example
  const headerRow = ['Columns (columns2)'];
  // The content row consists of one row, with multiple columns (cells)
  const columns = Array.from(element.children);
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columns
  ], document);
  element.replaceWith(table);
}
