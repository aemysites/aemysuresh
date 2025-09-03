/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct child offer cards
  const cards = Array.from(element.querySelectorAll(':scope > a.offer-card'));
  if (!cards.length) return;

  // Header row as per block guidelines
  const headerRow = ['Columns (columns18)'];

  // Each card becomes a column cell
  const contentRow = cards.map(card => card);

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
