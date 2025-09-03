/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image inside the element
  const img = element.querySelector('img');

  // Defensive: Only proceed if image exists
  if (!img) return;

  // Header row as per spec
  const headerRow = ['Columns (columns23)'];

  // Second row: single cell containing the image
  const contentRow = [img];

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
