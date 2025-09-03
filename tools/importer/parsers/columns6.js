/* global WebImporter */
export default function parse(element, { document }) {
  // Only process .d-flex.tabs blocks
  if (!element || !element.classList.contains('d-flex') || !element.classList.contains('tabs')) return;

  // Header row for the block table
  const headerRow = ['Columns (columns6)'];

  // Get all immediate children (columns)
  const columns = Array.from(element.children);

  // If there are no columns, abort
  if (!columns.length) return;

  // If all columns are empty visually, still create the block with empty cells (to match the visual structure)
  const contentRow = columns.map(() => '');

  // Build the table data
  const cells = [
    headerRow,
    contentRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
