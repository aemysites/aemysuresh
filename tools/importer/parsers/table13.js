/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Ensure element exists and is a container
  if (!element || !element.children || element.children.length === 0) return;

  // Table header row as specified
  const headerRow = ['Table (table13)'];

  // Get all immediate children (these are the columns visually)
  const columns = Array.from(element.children);

  // Compose a single row with all columns as cells
  // Each column is an empty div, but we reference the actual element for resilience
  const dataRow = [columns];

  // Compose the table cells array
  const cells = [headerRow, dataRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
