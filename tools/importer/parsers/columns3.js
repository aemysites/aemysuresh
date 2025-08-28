/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the table header row contains exactly one cell
  const headerRow = ['Columns (columns3)'];

  // Get all immediate child divs as columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Only create a row if there is at least one column
  if (!columns.length) return;

  // The columns are placed side-by-side in a single row (each as a cell)
  // This matches the example structure: header row (1 cell), content row (n cells)
  const cells = [headerRow, columns];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(blockTable);
}
