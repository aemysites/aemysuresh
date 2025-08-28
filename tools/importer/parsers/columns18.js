/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column with the block name
  const headerRow = ['Columns (columns18)'];

  // Second row: one column per card
  const cards = Array.from(element.querySelectorAll(':scope > a.offer-card'));
  const columnsRow = cards;

  // Compose the cells array with exactly one cell in the header row
  const cells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
