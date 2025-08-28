/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate child divs of the block (columns)
  const columnElements = Array.from(element.querySelectorAll(':scope > div'));
  // For this HTML, the actual content is the child divs themselves
  // Place both in the second row as cells
  const headerRow = ['Columns (columns2)']; // Exactly matches example
  const contentRow = columnElements; // Each is a cell in the row
  // Build the block table with single header cell and n columns in row two
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
