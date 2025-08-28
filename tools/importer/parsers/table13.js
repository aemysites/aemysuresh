/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block name header row
  const headerRow = ['Table (table13)'];

  // 2. Get all the immediate child divs, referencing the existing elements
  const cellDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Edge case: If no cells, just make an empty cell
  const contentRow = cellDivs.length > 0 ? [cellDivs] : [''];

  // 3. Table structure (2 rows, 1 column each)
  const tableRows = [
    headerRow,
    contentRow,
  ];

  // 4. Create table and replace
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
