/* global WebImporter */
export default function parse(element, { document }) {
  // The header row - should be a single column
  const headerRow = ['Table (table4)'];

  // Columns are each immediate child of the input element
  const columns = Array.from(element.children);

  // Defensive: Make sure we have 3 cells (fill with empty divs if missing)
  const numCols = 3;
  const dataRow = [];
  for (let i = 0; i < numCols; i++) {
    if (columns[i]) {
      dataRow.push(columns[i]);
    } else {
      const emptyDiv = document.createElement('div');
      dataRow.push(emptyDiv);
    }
  }

  // Compose cells: header row (one cell), then one data row (three cells)
  const cells = [
    headerRow,
    dataRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
