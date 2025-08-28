/* global WebImporter */
export default function parse(element, { document }) {
  // Header should be a single column: ['Columns (columns1)']
  const headerRow = ['Columns (columns1)'];

  // Extract direct child divs as columns (each cell)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each row must be an array, and the header row must only have one column
  // Data row can have N columns as needed
  const cells = [
    headerRow,
    columns
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
