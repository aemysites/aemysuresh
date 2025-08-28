/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from the example
  const headerRow = ['Table (table1)'];
  
  // Get all immediate children of the block (should be the three columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // The mock table structure for this skeleton table visual uses just one row, three columns
  // The table layout matches the provided screenshot (empty skeletons in three columns)
  const dataRow = columns;

  // The block table expects a 1-col table (header), then a single row with the entire set of columns in a cell
  // To match the standard for Table (table1), the columns should be grouped in an array in one cell
  const cells = [headerRow, [dataRow]];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original skeleton HTML with the table block
  element.replaceWith(table);
}
