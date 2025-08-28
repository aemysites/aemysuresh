/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Table (table22)'];

  // Get all visible columns (each immediate child div of the main row div)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, we want the first child (the visual cell)
  // If a column has no children, put an empty string to maintain the structure
  const dataRow = columns.map((col) => {
    const child = col.firstElementChild;
    return child ? child : '';
  });

  // Compose the table
  const cells = [headerRow, dataRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
