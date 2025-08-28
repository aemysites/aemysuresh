/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row exactly as specified
  const headerRow = ['Table (table13)'];

  // Edge case: If there are no children, insert an empty cell
  const columns = Array.from(element.children);
  const dataRow = columns.length > 0 ? [columns] : [''];

  // Build table structure: header row, then row containing all columns
  const cells = [
    headerRow,
    dataRow,
  ];

  // Create the table and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
