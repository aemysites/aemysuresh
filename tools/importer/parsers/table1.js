/* global WebImporter */
export default function parse(element, { document }) {
  // The header row is a single column with the block name
  const headerRow = ['Table (table1)'];
  // The content row should have three columns, each from the immediate children
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: If less than 3 columns, fill the remaining with empty divs
  while (columns.length < 3) {
    columns.push(document.createElement('div'));
  }
  // Compose the table rows: first row is header (single cell), then one row (three cells)
  const rows = [headerRow, columns];
  // Create and replace with the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
