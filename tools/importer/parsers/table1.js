/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches block name exactly
  const headerRow = ['Table (table1)'];
  // Each immediate child div is a column; inside each is a 'comment' placeholder, representing the table cell
  const colDivs = Array.from(element.querySelectorAll(':scope > div'));
  // For edge case: if no columns, insert empty row
  let dataRow = [];
  if (colDivs.length) {
    // For each column, grab the first child div with class 'comment' (the cell)
    dataRow = colDivs.map(colDiv => {
      const cellDiv = colDiv.querySelector('.comment');
      return cellDiv ? cellDiv : '';
    });
  } else {
    // If there are no columns, fall back to a single empty cell
    dataRow = [''];
  }
  // Build the table: header row, then one row for data
  const cells = [headerRow, dataRow];
  // Create the block table using referenced elements
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
